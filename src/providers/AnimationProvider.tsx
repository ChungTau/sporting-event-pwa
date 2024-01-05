import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimationContext, AnimationContextProps} from "../contexts/AnimationContext";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Feature, LineString, Position, Properties, Units, along, distance, lineString, point, length } from "@turf/turf";
import { useMap } from "../contexts/MapContext";
import { addLineLayer, resizeMap } from "../helpers/map";
import { calculateAnimationPhase, computeElevationChange, executeFlyTo } from "../helpers/mapAnim";
import { lerp } from "../helpers/lerp";

export const useAnimation = () => {
    const context = useContext(AnimationContext);

    if (!context) {
        throw new Error('useAnimation must be used within an AnimationProvider that provides the required context values.');
    }

    return context;
};

type AnimationProviderProps = {
    children: ReactNode;
};

const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
    const { data } = useSelector((state: RootState) => state.gpx);
    const [pitch, setPitch] = useState<number>(40);
    const [speed, setSpeed] = useState<number>(1);
    const [zoomLevel, setZoomLevel] = useState<number>(16.2);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationFrameId = useRef<number | null>(null);
    const start = useRef<number>(0);
    const startTime = useRef<number>(0);
    const elapsedTime = useRef<number>(0);
    const lastPositionRef = useRef<Position | null>(null);
    const isPlayingRef = useRef<boolean>(false);
    const [currentRouteIndex, setCurrentRouteIndex] = useState<number>(0);
    const [cumulativeElevationGain, setCumulativeElevationGain] = useState(0);
    const [currentDistance, setCurrentDistance] = useState(0);
    const zoomRef = useRef(0);
    const bearingRef = useRef(0);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [progressLine, setProgressLine] = useState<Position[][]>([]);
    const map = useMap();

    useEffect(() => {
        isPlayingRef.current = isPlaying; // Sync ref with state to use inside the callback
    }, [isPlaying]);

    
    useEffect(() => {
        if (data?.routes) {
            if (data.routes.geometry.type === "LineString") {
                setCurrentPosition(data.routes.geometry.coordinates[0]);
                setProgressLine([data.routes.geometry.coordinates.slice(0, 2)]);
            } else if (data.routes.geometry.type === "MultiLineString") {
                setCurrentPosition(data.routes.geometry.coordinates[0][0]);
                setProgressLine([data.routes.geometry.coordinates[0].slice(0, 2)]);
            }
        }
    }, [data?.routes]);
    
    useEffect(() => {
        if (currentPosition && map.mapRef.current && map.mapRef.current.getMapInstance() && map.mapRef.current.getMapInstance()._fullyLoaded) {
            setProgressLine((lines: Position[][]) => {
                if (!lines[currentRouteIndex]) {
                    return [...lines, [currentPosition]];
                }
                const updatedLines = [...lines];
                updatedLines[currentRouteIndex] = [...updatedLines[currentRouteIndex], currentPosition];
                return updatedLines;
            });
        }
    }, [currentPosition, currentRouteIndex, map.mapRef]);
    
    useEffect(() => {
        if (progressLine.length > 0 && data?.routes) {
            const mapInstance = map.mapRef.current.getMapInstance();
            const color = "#f74d63";
            if (mapInstance && mapInstance.style !== undefined && mapInstance.style._loaded) {
                if (data.routes.geometry.type === "LineString" && progressLine[0].length >= 2) {
                    const progressRoute = lineString(progressLine[0]);
                    addLineLayer('lineA', map.mapRef, color, progressRoute);
                } else if (data.routes.geometry.type === "MultiLineString") {
                    progressLine.forEach((lineSegment, index) => {
                        if (lineSegment.length >= 2) {
                            const progressRoute = lineString(lineSegment);
                            const layerId = `line${index}`;
                            addLineLayer(layerId, map.mapRef, color, progressRoute);
                        }
                    });
                }
            }
        }
    }, [progressLine, data?.routes, map.mapRef]);

    const fadeOutRouteLayers = useCallback(() => {
        if (map.mapRef.current && data?.routes) {
            const mapInstance = map.mapRef.current.getMapInstance();

            if (data?.routes
                ?.geometry.type === "LineString") {
                const layerId = `routeLayer`;
                if (mapInstance.getLayer(layerId)) {
                    mapInstance.setPaintProperty(layerId, 'line-opacity', 0);
                }
            } else if (data?.routes
                ?.geometry.type === "MultiLineString") {
                    data?.routes
                    .geometry
                    .coordinates
                      .forEach((route, index) => {
                        const layerId = `routeLayer${index}`;
                        if (mapInstance.getLayer(layerId)) {
                            mapInstance.setPaintProperty(layerId, 'line-opacity', 0);
                        }
                    });
            }
        }
    },[data?.routes, map.mapRef]);
    const fadeInRouteLayers = useCallback(() => {
        if (map.mapRef.current && data?.routes) {
            const mapInstance = map.mapRef.current.getMapInstance();

            if (data?.routes
                ?.geometry.type === "LineString") {
                const layerId = `routeLayer`;
                if (mapInstance.getLayer(layerId)) {
                    mapInstance.setPaintProperty(layerId, 'line-opacity', 1);
                }
            } else if (data?.routes
                ?.geometry.type === "MultiLineString") {
                    data?.routes
                    .geometry
                    .coordinates
                    .forEach((route, index) => {
                        const layerId = `routeLayer${index}`;
                        if (mapInstance.getLayer(layerId)) {
                            mapInstance.setPaintProperty(layerId, 'line-opacity', 1);
                        }
                    });
            }
        }
    },[data?.routes, map?.mapRef]);

    const handleResize = useCallback(() => {
        resizeMap(data?.routes, map.mapRef);
    }, [data?.routes, map.mapRef]);

    const resetAnimation = useCallback((resetRouteIndex = true) => {
        if (animationFrameId.current) {
            window.cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null; // reset the animation frame id
        }
        setCurrentDistance(0);
        setCumulativeElevationGain(0);
        setIsPlaying(false);
        lastPositionRef.current = null;
        isPlayingRef.current = false;
        startTime.current = 0;
        start.current = 0;
        elapsedTime.current = 0;
        bearingRef.current = 0;
        zoomRef.current = 0;
        if (resetRouteIndex) {
            setCurrentRouteIndex(0);
        }
        if (data?.routes) {
            if (data?.routes.geometry.type === "LineString") {
                setCurrentPosition(data?.routes.geometry.coordinates[0]);
                setProgressLine([data?.routes.geometry.coordinates.slice(0, 2)]);
            } else if (data.routes.geometry.type === "MultiLineString") {
                setCurrentPosition(data?.routes.geometry.coordinates[0][0]);
                setProgressLine([data?.routes.geometry.coordinates[0].slice(0, 2)]);
            }
        } else {
            setCurrentPosition([]);
            setProgressLine([]);
        }

        const mapInstance = map.mapRef.current
            ?.getMapInstance();
        if (data?.routes && mapInstance) {
            if (data.routes.geometry.type === "LineString") {
                if(mapInstance.getLayer('lineA')){
                    
                    mapInstance.removeLayer('lineA');
                    mapInstance.removeSource('lineA');
                }
            } else if (data.routes.geometry.type === "MultiLineString") {
                for(let i=0; i<data.routes.geometry.coordinates.length ;i++){
                    if(mapInstance.getLayer(`line${i}`)){
                        mapInstance.removeLayer(`line${i}`);
                        mapInstance.removeSource(`line${i}`);
                    }
                }
            }
            //mapInstance.setPaintProperty('lineA', 'line-opacity', 0);
            //mapInstance.removeLayer('line0');
        }
        fadeInRouteLayers();
        handleResize();
    }, [data?.routes, handleResize, fadeInRouteLayers, map.mapRef]);

    const animateFlyAlongRoute = useCallback((time : number) => {
        if (!isPlayingRef.current) {
            elapsedTime.current += time - startTime.current;
            return;
        }
        if (!startTime.current) 
            startTime.current = time;
        
        const handleAnimation = (route : Feature < LineString, Properties >, routeIndex : number = 0) => {
            const distanceOfCurrentRoute = length(route);
            const animationPhase = calculateAnimationPhase(distanceOfCurrentRoute, time, elapsedTime, startTime, start, speed);
            if (animationPhase > 1) {
                const newIndex = routeIndex + 1;
                if (data
                    ?.routes
                        ?.geometry.type === "MultiLineString" && newIndex < data.routes.geometry.coordinates.length) {
                    if (animationFrameId.current) {
                        window.cancelAnimationFrame(animationFrameId.current);
                        animationFrameId.current = null; // reset the animation frame id
                    }
                    start.current = 0;
                    elapsedTime.current = 0;
                    startTime.current = 0; // Reset start time for the next segment
                    setCurrentRouteIndex(newIndex);
                    setCurrentPosition(data
                        ?.routes.geometry.coordinates[newIndex][0]as Position);
                    lastPositionRef.current = data
                        ?.routes.geometry.coordinates[newIndex][0];
                    return;
                } else {
                    resetAnimation();
                    //fadeInRouteLayers();
                    return;
                }
            }
            const alongPath = along(route, distanceOfCurrentRoute * animationPhase).geometry.coordinates;
            setCurrentPosition(alongPath);
            if (lastPositionRef.current) {
                const lastPositionPoint = point(lastPositionRef.current);
                const currentPositionPoint = point(alongPath);
                const options = {
                    units: "kilometers" as Units
                };
                const distanceTravelled = distance(lastPositionPoint, currentPositionPoint, options);
                setCurrentDistance(prevDistance => prevDistance + distanceTravelled);

                if (data
                    ?.info.climb !== 0) {
                    const currentElevationChange = computeElevationChange(lastPositionRef.current, alongPath, data
                        ?.routes
                            ?.geometry.type === "LineString"
                                ? data.routes.geometry.coordinates
                                : data
                                    ?.routes
                                        ?.geometry.coordinates[routeIndex], data);
                    if (currentElevationChange > 0) {
                        setCumulativeElevationGain(prevElevation => prevElevation + currentElevationChange);
                    }
                }
            }
            lastPositionRef.current = alongPath;
            const bearing = routeIndex !== 0
                ? bearingRef.current
                : (0 + animationPhase * 300.0);
            bearingRef.current = bearing;
            if (map.mapRef.current) {
                const currentView = map.mapRef
                    .current
                    .getMapInstance()
                    ?.getCenter()!;
                const interpolatedView = [
                    lerp(currentView.lng, alongPath[0], 0.05),
                    lerp(currentView.lat, alongPath[1], 0.05)
                ];

                const currentElevation = map.mapRef
                    .current
                    .getMapInstance()
                    ?.queryTerrainElevation(currentView);
                const targetElevation = map.mapRef
                    .current
                    .getMapInstance()
                    ?.queryTerrainElevation(interpolatedView);
                const currentZoomLevel = zoomLevel - ((currentElevation ?? 1) / 16) * 0.001;
                const targetZoomLevel = zoomLevel - ((targetElevation ?? 1) / 16) * 0.001;
                const zoomLevel2 = lerp(currentZoomLevel, targetZoomLevel, 0.35);

                zoomRef.current = zoomLevel2;

                map.mapRef
                    .current
                    .getMapInstance()
                    ?.easeTo({center: interpolatedView, pitch: pitch, bearing: bearingRef.current, zoom: zoomLevel2, duration: 0});

                animationFrameId.current = window.requestAnimationFrame(animateFlyAlongRoute);
            }
        }
        if (data?.routes && currentPosition) {
            if (data?.routes.geometry.type === "LineString") {
                handleAnimation(data?.routes as Feature<LineString, Properties>);
            } else if (data?.routes.geometry.type === "MultiLineString") {
                handleAnimation(lineString(data?.routes.geometry.coordinates[currentRouteIndex]), currentRouteIndex);
            }
        }
        
    }, [currentPosition, pitch, zoomLevel, speed, currentRouteIndex, data, map.mapRef, resetAnimation]);

    const flyToRoute = useCallback(() => {
        executeFlyTo(map.mapRef.current?.getMapInstance(), currentPosition!, 2000, pitch, bearingRef.current, startTime.current, zoomRef, zoomLevel);
        setTimeout(() => {
            animationFrameId.current = window.requestAnimationFrame(animateFlyAlongRoute);
        }, 2400);
    }, [currentPosition, pitch, zoomLevel, animateFlyAlongRoute, map.mapRef]);

    const startAnimation = useCallback(() => {
        setIsPlaying(prevState => {
            const newValue = !prevState;
            if (newValue) {
                fadeOutRouteLayers();
                startTime.current = 0;
                flyToRoute();
            }
            return newValue;
        });
    }, [ fadeOutRouteLayers, flyToRoute]);

    

    

    useEffect(()=>{
        if(currentRouteIndex){
            if (map.mapRef.current && currentPosition) {
                const currentElevation = map.mapRef
                    .current
                    .getMapInstance()
                    ?.queryTerrainElevation([currentPosition[0], currentPosition[1]]);
                let currentZoomLevel = zoomLevel - (((currentElevation ?? 1.25) / 1.25) / 13) * 0.01;
                map.mapRef
                    .current
                    .getMapInstance()
                    ?.flyTo({
                        center: [
                            currentPosition[0], currentPosition[1]
                        ],
                        pitch: pitch,
                        bearing: bearingRef.current,
                        duration: 6000,
                        zoom: (startTime.current === 0)
                            ? currentZoomLevel
                            : zoomRef.current
                    });
            }
            setTimeout(()=>{
                animationFrameId.current = window.requestAnimationFrame(animateFlyAlongRoute);
            },6400);
        }
    }, [currentRouteIndex, zoomLevel, pitch, animateFlyAlongRoute, currentPosition, map.mapRef]);

    

    

    const providerValue: AnimationContextProps = {
        pitch,
        speed,
        zoomLevel,
        setPitch,
        setSpeed,
        setZoomLevel,
        isPlaying,
        isCompleted: elapsedTime.current === 0,
        info: {
            elevationGain: cumulativeElevationGain,
            distance: currentDistance
        },
        start: startAnimation,
        reset: resetAnimation,
    };

    return (
        <AnimationContext.Provider value={providerValue}>
            {children}
        </AnimationContext.Provider>
    );
};

export default AnimationProvider;