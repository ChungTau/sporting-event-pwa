import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimationContext, AnimationContextProps} from "../contexts/AnimationContext";
import { Feature, LineString, Position, Properties, Units, along, distance, lineString, point, length } from "@turf/turf";
import { useMap } from "../contexts/MapContext";
import { addLineLayer, resizeMap } from "../helpers/map";
import { calculateAnimationPhase, computeElevationChange, executeFlyTo } from "../helpers/mapAnim";
import { lerp } from "../helpers/lerp";
//@ts-ignore
import Whammy from 'react-whammy'
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import { useGPX } from "../contexts/GPXContext";

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
    const gpx = useGPX();
    const [pitch, setPitch] = useState<number>(40);
    const [speed, setSpeed] = useState<number>(1);
    const [zoomLevel, setZoomLevel] = useState<number>(16.2);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationFrameId = useRef<number | null>(null);
    const start = useRef<number>(0);
    const startTime = useRef<number>(0);
    const elapsedTime = useRef<number>(0);
    const lastPositionRef = useRef<Position | null>(null);
    const isPlayingRef = useRef<boolean>(isPlaying);
    const [currentRouteIndex, setCurrentRouteIndex] = useState<number>(0);
    const [cumulativeElevationGain, setCumulativeElevationGain] = useState(0);
    const [currentDistance, setCurrentDistance] = useState(0);
    const zoomRef = useRef(0);
    const bearingRef = useRef(0);
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [progressLine, setProgressLine] = useState<Position[][]>([]);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const map = useMap();

    useEffect(() => {
        isPlayingRef.current = isPlaying; // Sync ref with state to use inside the callback
    }, [isPlaying]);

    useEffect(() => {
        if (recording) {
            // Initialize video encoder
            const canvas = document.createElement('canvas');
            
            const initVideoEncoder = async () => {
                const mapInstance = map.mapRef.current.getMapInstance();
                const gl = mapInstance.painter.context.gl;
                const originalCanvas = gl.canvas;
                
                canvas.height = gl.drawingBufferHeight;
                //canvas.width = gl.drawingBufferHeight * (9/16);
                canvas.width = gl.drawingBufferWidth;
                // Get the 2D context of the cloned canvas
                const ctx = canvas.getContext('2d');
                const fps = 24;
                const encoder = new Whammy.Video(fps);
                //const offsetX = (canvas.width - gl.drawingBufferWidth) / 2;
                if (!ctx) {
                    console.error('Off-screen Canvas 2D context is null.');
                    return () => {
                        mapInstance.off('render', frame);
                        mapboxgl.restoreNow();
                    };
                }

                const frame = () => {
                    // Ensure offScreenCtx is not null before using it
                    if (ctx) {
                        //ctx.drawImage(originalCanvas, offsetX, 0, gl.drawingBufferWidth, canvas.height);
                        ctx.drawImage(originalCanvas, 0, 0, canvas.width, canvas.height);
                        encoder.add(ctx);
                    }
                };
                mapInstance.on('render', frame);
    
                return () => {
                    mapInstance.off('render', frame);
                    mapboxgl.restoreNow();
                };
            };
    
            // Start video recording
            const startRecording = async () => {
                const cleanupEncoder = await initVideoEncoder();
                chunksRef.current = [];
                const canvasStream = canvas.captureStream();
                mediaRecorderRef.current = new MediaRecorder(canvasStream, {
                    mimeType: 'video/webm; codecs=vp9',
                });
    
                // Handle data available event
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunksRef.current.push(event.data);
                    }
                };
    
                // Handle recording stopped event
                mediaRecorderRef.current.onstop = () => {
                    // Combine recorded chunks into a single Blob
                    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    
                    // Create a download link for the user
                    const anchor = document.createElement('a');
                    anchor.href = URL.createObjectURL(blob);
                    anchor.download = 'map_animation.webm';
                    anchor.click();
    
                    // Reset recording state
                    setRecording(false);
                    chunksRef.current = [];
    
                    // Clean up resources
                    cleanupEncoder();
                };
    
                // Start recording
                mediaRecorderRef.current.start();
            };
    
            // Stop video recording
            const stopRecording = () => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                }
            };
    
            // Start recording when animation starts
            if (isPlaying) {
                startRecording();
            } else {
                // Stop recording when animation stops
                stopRecording();
            }
        }
    }, [isPlaying, map, recording]);
    
    useEffect(() => {
        if (gpx.gpxState.data?.routes) {
            if (gpx.gpxState.data?.routes.geometry.type === "LineString") {
                setCurrentPosition(gpx.gpxState.data?.routes.geometry.coordinates[0]);
                setProgressLine([gpx.gpxState.data?.routes.geometry.coordinates.slice(0, 2)]);
            } else if (gpx.gpxState.data?.routes.geometry.type === "MultiLineString") {
                setCurrentPosition(gpx.gpxState.data?.routes.geometry.coordinates[0][0]);
                setProgressLine([gpx.gpxState.data?.routes.geometry.coordinates[0].slice(0, 2)]);
            }
        }
    }, [gpx.gpxState.data?.routes]);
    

    const fadeOutRouteLayers = useCallback(() => {
        if (map.mapRef.current && gpx.gpxState.data?.routes) {
            const mapInstance = map.mapRef.current.getMapInstance();

            if (gpx.gpxState.data?.routes
                ?.geometry.type === "LineString") {
                const layerId = `routeLayer`;
                if (mapInstance.getLayer(layerId)) {
                    mapInstance.setPaintProperty(layerId, 'line-opacity', 0);
                }
            } else if (gpx.gpxState.data?.routes
                ?.geometry.type === "MultiLineString") {
                    gpx.gpxState.data?.routes
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
    },[gpx.gpxState.data?.routes, map.mapRef]);
    const fadeInRouteLayers = useCallback(() => {
        if (map.mapRef.current && gpx.gpxState.data?.routes) {
            const mapInstance = map.mapRef.current.getMapInstance();

            if (gpx.gpxState.data?.routes
                ?.geometry.type === "LineString") {
                const layerId = `routeLayer`;
                if (mapInstance.getLayer(layerId)) {
                    mapInstance.setPaintProperty(layerId, 'line-opacity', 1);
                }
            } else if (gpx.gpxState.data?.routes
                ?.geometry.type === "MultiLineString") {
                    gpx.gpxState.data?.routes
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
    },[gpx.gpxState.data?.routes, map?.mapRef]);

    const handleResize = useCallback(() => {
        resizeMap(gpx.gpxState.data?.routes, map.mapRef);
    }, [gpx.gpxState.data?.routes, map.mapRef]);

    const resetAnimation = useCallback((resetRouteIndex = true) => {
        if (animationFrameId.current) {
            window.cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null; // reset the animation frame id
        }
        setCurrentDistance(0);
        setCumulativeElevationGain(0);
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
        if (resetRouteIndex) {
            if (gpx.gpxState.data?.routes.geometry.type === "LineString") {
                setCurrentPosition(gpx.gpxState.data?.routes.geometry.coordinates[0]);
                setProgressLine([gpx.gpxState.data?.routes.geometry.coordinates.slice(0, 2)]);
            } else if (gpx.gpxState.data?.routes.geometry.type === "MultiLineString") {
                setCurrentPosition(gpx.gpxState.data?.routes.geometry.coordinates[0][0]);
                setProgressLine([gpx.gpxState.data?.routes.geometry.coordinates[0].slice(0, 2)]);
            }
            fadeInRouteLayers();
            handleResize();
            setTimeout(()=>{
                setIsPlaying(false);
            },4000);
        }
        

        const mapInstance = map.mapRef.current
            ?.getMapInstance();
        if (gpx.gpxState.data?.routes && mapInstance) {
            if (gpx.gpxState.data?.routes.geometry.type === "LineString") {
                if(mapInstance.getLayer('lineA')){
                    
                    mapInstance.removeLayer('lineA');
                    mapInstance.removeSource('lineA');
                }
            } else if (gpx.gpxState.data?.routes.geometry.type === "MultiLineString") {
                for(let i=0; i<gpx.gpxState.data?.routes.geometry.coordinates.length ;i++){
                    if(mapInstance.getLayer(`line${i}`)){
                        mapInstance.removeLayer(`line${i}`);
                        mapInstance.removeSource(`line${i}`);
                    }
                }
            }
            //mapInstance.setPaintProperty('lineA', 'line-opacity', 0);
            //mapInstance.removeLayer('line0');
        }
        
    }, [gpx.gpxState.data?.routes, handleResize, fadeInRouteLayers, map.mapRef]);

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
                if (gpx.gpxState.data?.routes?.geometry.type === "MultiLineString" && newIndex < gpx.gpxState.data?.routes.geometry.coordinates.length) {
                    if (animationFrameId.current) {
                        window.cancelAnimationFrame(animationFrameId.current);
                        animationFrameId.current = null; // reset the animation frame id
                    }
                    start.current = 0;
                    elapsedTime.current = 0;
                    startTime.current = 0; // Reset start time for the next segment
                    setCurrentRouteIndex(newIndex);
                    setCurrentPosition(gpx.gpxState.data?.routes.geometry.coordinates[newIndex][0] as Position);
                    lastPositionRef.current = gpx.gpxState.data?.routes.geometry.coordinates[newIndex][0];
                    return;
                } else {
                    resetAnimation();
                    fadeInRouteLayers();
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

                if (gpx.gpxState.data?.info.climb !== 0) {
                    const currentElevationChange = computeElevationChange(lastPositionRef.current, alongPath, gpx.gpxState.data?.routes
                            ?.geometry.type === "LineString"
                                ? gpx.gpxState.data?.routes.geometry.coordinates
                                : gpx.gpxState.data?.routes
                                        ?.geometry.coordinates[routeIndex], gpx.gpxState.data);
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
        if (gpx.gpxState.data?.routes && currentPosition) {
            if (gpx.gpxState.data?.routes.geometry.type === "LineString") {
                handleAnimation(gpx.gpxState.data?.routes as Feature<LineString, Properties>);
            } else if (gpx.gpxState.data?.routes.geometry.type === "MultiLineString") {
                handleAnimation(lineString(gpx.gpxState.data?.routes.geometry.coordinates[currentRouteIndex]), currentRouteIndex);
            }
        }
        
    }, [currentPosition, pitch, zoomLevel, speed, currentRouteIndex, fadeInRouteLayers, gpx.gpxState.data, map.mapRef, resetAnimation]);

    const flyToRoute = useCallback(
        () => {
        
            executeFlyTo(map.mapRef.current?.getMapInstance(), currentPosition!, 2000, pitch, bearingRef.current, startTime.current, zoomRef, zoomLevel);
            setTimeout(() => {
                animationFrameId.current = window.requestAnimationFrame(animateFlyAlongRoute);
            }, 2400);
        },[animateFlyAlongRoute, currentPosition, map.mapRef, pitch, zoomLevel]
    );

    const startAnimation = useCallback(
        () => {
            setIsPlaying(prevState => !prevState);
        },[]
    );

    useEffect(() => {
        // This effect runs only once when the component mounts
        if (isPlaying) {
            // Start animation when isPlaying is true
            fadeOutRouteLayers();
            startTime.current = 0;
            flyToRoute();
        } else {
            fadeInRouteLayers();
        }
        // eslint-disable-next-line
    }, [isPlaying, fadeInRouteLayers, fadeOutRouteLayers]);

    const recordAnimation = useCallback(() => {
        if(recording){
            setRecording(!recording);
            resetAnimation();
        }else{
            setRecording(!recording);
            startAnimation();
        }
    }, [startAnimation, resetAnimation, recording]);

/* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (currentPosition && map.isStyleLoaded && map.mapRef.current) {
            setProgressLine((lines: Position[][]) => {
                if (!lines[currentRouteIndex]) {
                    return [...lines, [currentPosition]];
                }
                const updatedLines = [...lines];
                updatedLines[currentRouteIndex] = [...updatedLines[currentRouteIndex], currentPosition];
                return updatedLines;
            });
    
            const mapInstance = map.mapRef.current.getMapInstance();
            const color = "#f74d63";
            if (mapInstance && mapInstance.style !== undefined && mapInstance.style._loaded && isPlaying) {
                if (gpx.gpxState.data?.routes.geometry.type === "LineString" && progressLine[0].length >= 2) {
                    const progressRoute = lineString(progressLine[0]);
                    addLineLayer('lineA', map.mapRef, color, progressRoute);
                } else if (gpx.gpxState.data?.routes.geometry.type === "MultiLineString") {
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
    }, [currentPosition, currentRouteIndex, map.isStyleLoaded, gpx.gpxState.data?.routes.geometry.type, map.mapRef]);
     /* eslint-enable react-hooks/exhaustive-deps */

     /* eslint-disable react-hooks/exhaustive-deps */
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
    }, [currentRouteIndex, pitch, map.mapRef, zoomLevel]);
 /* eslint-enable react-hooks/exhaustive-deps */

    const providerValue: AnimationContextProps = {
        pitch,
        speed,
        zoomLevel,
        setPitch,
        setSpeed,
        setZoomLevel,
        isPlaying,
        isRecording: recording,
        isCompleted: elapsedTime.current === 0,
        info: {
            elevationGain: cumulativeElevationGain,
            distance: currentDistance
        },
        start: startAnimation,
        reset: resetAnimation,
        record: recordAnimation
    };

    return (
        <AnimationContext.Provider value={providerValue}>
            {children}
        </AnimationContext.Provider>
    );
};

export default AnimationProvider;