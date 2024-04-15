import {useCallback, useEffect, useRef, useState} from 'react';

import {
    Feature,
    MultiLineString,
    LineString,
    Properties,
    Position,
    length,
    along,
    lineString
    //@ts-ignore
} from '@turf/turf';
import {MapRef} from 'react-map-gl';
import {MAP_PADDING, calculateAnimationPhase, executeFlyTo, lerp, removeProgressLines, resizeMap, updateLineToMap} from '.';
import {useMapAnimStore} from '@/store/useMapAnimDataStore';
import { useGpxDataStore } from '@/store/useGpxDataStore';

export interface AnimationHook {
    startAnimation : () => void;
    stopAnimation : () => void;
    recordAnimation : () => void;
}

export const useAnimation = (routes : Feature < MultiLineString, Properties > | Feature < LineString, Properties >, mapview : MapRef | undefined) : AnimationHook => {
    const {pitch, zoom, speed, isPlaying, setIsPlaying} = useMapAnimStore(state => state);
    const {inPage} = useGpxDataStore();
    const [recording, setRecording] = useState(false);
    const [currentPosition,
        setCurrentPosition] = useState < Position | null > (null);
    const [progressLine, setProgressLine] = useState<Position[][]>([]);
    const animationFrameIds = useRef < number[] > ([]);
    const [currentRouteIndex,
        setCurrentRouteIndex] = useState < number > (0);
        const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const animationControlRefs = useRef({
        startTime: 0,
        elapsedTime: 0,
        isPlaying: isPlaying,
        lastPosition: null as Position | null,
        zoomRef: 0,
        bearingRef: 0,
        start: 0
    }).current;

    const cancelAllAnimationFrames = () => {
        animationFrameIds
            .current
            .forEach(id => cancelAnimationFrame(id));
        animationFrameIds.current = [];
    };

    useEffect(() => {
        if (!recording || !mapview) {
            return;
        }
    
        const canvas = document.createElement('canvas');
        let cleanupEncoder = () => {};
    
        const initVideoEncoder = async () => {
            const gl = mapview.getCanvas().getContext('webgl2');
            if (!gl) {
                // Return a no-op function if gl context is not available
                return () => {};
            }
        
            const originalCanvas = gl.canvas;
            canvas.height = gl.drawingBufferHeight;
            canvas.width = gl.drawingBufferWidth;
            const ctx = canvas.getContext('2d');
        
            const frame = () => {
                if (ctx) {
                    ctx.drawImage(originalCanvas, 0, 0, canvas.width, canvas.height);
                }
            };
        
            mapview.on('render', frame);
        
            // Return a cleanup function to remove the event listener
            return () => mapview.off('render', frame);
        };
        

        const startRecording = async () => {
            cleanupEncoder = await initVideoEncoder(); // This now always assigns a function
        
            chunksRef.current = [];
            const canvasStream = canvas.captureStream(120); // Assuming 25 FPS for the recording
            mediaRecorderRef.current = new MediaRecorder(canvasStream, {
                mimeType: 'video/webm; codecs=vp9',
            });
        
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

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
        
    
        const stopRecording = async() => {
            if (mediaRecorderRef.current?.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            cleanupEncoder();
        };
    
        // Control the recording based on the animation state
        if (isPlaying) {
            startRecording();
        } else {
            stopRecording();
        }
    
        // Cleanup function to stop recording if the component unmounts or recording stops
        return () => {
            stopRecording();
        };
    
    }, [recording, mapview, isPlaying]);
     // Assuming `isPlaying` is a dependency that determines if the recording should start or stop.
    
    useEffect(() => {
        animationControlRefs.isPlaying = isPlaying;
    }, [isPlaying]);

    const getInitialPosition = (routes : Feature < MultiLineString, Properties > | Feature < LineString, Properties >) => routes.geometry.type === "LineString"
        ? routes.geometry.coordinates[0]
        : routes.geometry.coordinates[0][0];

        const getInitialProgress = (routes: Feature<MultiLineString, Properties> | Feature<LineString, Properties>) => {
            if (routes.geometry.type === "LineString") {
              return [routes.geometry.coordinates.slice(0, 2)];
            } else if (routes.geometry.type === "MultiLineString") {
                return routes.geometry.coordinates.map((lineString : Feature<LineString, Properties>) => lineString.slice(0, 2));
            }
          };

          const resetAnimationState = useCallback((resetRouteIndex = true, delay : number = 0) => {
            cancelAllAnimationFrames();
    
            if (resetRouteIndex) {
                setCurrentRouteIndex(0);
                setCurrentPosition(getInitialPosition(routes));
                setProgressLine(getInitialProgress(routes));
            }
    
            Object.assign(animationControlRefs, {
                lastPosition: null,
                startTime: 0,
                start: 0,
                elapsedTime: 0,
                bearingRef: 0,
                zoomRef: 0
            });
    
            setTimeout(() => {
                setIsPlaying(false);
            }, delay);
            updateRouteLayersVisibility(true);
            removeProgressLines(mapview, progressLine);
            resizeMap(mapview, routes, 2600, inPage === "live" ? {
                top: 80,
                bottom: 500,
                left: 40,
                right: 40
            }:MAP_PADDING);
        }, [routes, mapview, currentPosition]);

    useEffect(() => {
        if (routes && mapview) {
            resetAnimationState(true);
        }
    }, [routes, mapview]);

    useEffect(()=>{
        if(routes && mapview && progressLine && isPlaying && currentPosition){
            progressLine[currentRouteIndex].push(currentPosition);
            const color = "#00ff00";
            const map = mapview.getMap();
            if(isPlaying && map){
                if(routes.geometry.type === "LineString" && progressLine[0].length >= 2){
                    const progressRoute = lineString(progressLine[0]);
                    const sId= `progressLineSource${currentRouteIndex}`;
                    const lId = `layer_base`;
                    updateLineToMap(map, sId, lId, progressRoute, color);
                }else if (routes.geometry.type === "MultiLineString") {
                    progressLine.forEach((line, index) => {
                        if (line.length >= 2) {
                            const progressRoute = lineString(line);
                            const sId = `progressLineSource${index}`;
                            const lId = `layer_${index}`;
                            updateLineToMap(map, sId, lId, progressRoute, color);
                        }
                    });
                }
            }
        }
    },[ currentRouteIndex, currentPosition, isPlaying, progressLine, routes, mapview]);

    const updateRouteLayersVisibility = useCallback((isVisible: boolean) => {
        const opacity = isVisible ? 1 : 0;
        const transitionDuration = 1000; // 1 second
    
        if (mapview&& routes) {
            const mapInstance = mapview.getMap();
            const setLayerOpacity = (layerId:string) => {
                if (mapInstance.getLayer(layerId)) {
                    mapInstance.setPaintProperty(layerId, 'line-opacity', opacity);
                    mapInstance.setPaintProperty(layerId, 'line-opacity-transition', { duration: transitionDuration });
                }
            };
    
            if (routes.geometry.type === "LineString") {
                setLayerOpacity('lineLayer');
            } else if (routes.geometry.type === "MultiLineString") {
                routes.geometry.coordinates.forEach((_coord:Position, index:number) => {
                    setLayerOpacity(`layer${index}`);
                });
            }
        }
    }, [routes, mapview]);

    const startAnimation = useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying, setIsPlaying]);

    const stopAnimation = useCallback(() => {
        resetAnimationState(true, 4000); // Optionally pass false if you don't want to reset the route index
    }, [resetAnimationState]);

    const animateFlyAlongRoute = useCallback((time : number) => {
        if (!animationControlRefs.isPlaying) {
            animationControlRefs.elapsedTime += time - animationControlRefs.startTime;
            return;
        }
        if (!animationControlRefs.startTime) 
            animationControlRefs.startTime = time;
        const handleAnimation = (route : Feature < LineString, Properties >, routeIndex : number = 0) => {
            const distanceOfCurrentRoute = length(route);
            const animationPhase = calculateAnimationPhase(distanceOfCurrentRoute, time, animationControlRefs.elapsedTime, animationControlRefs.startTime, animationControlRefs.start, speed);

            if (animationPhase > 1) {
                const newIndex = routeIndex + 1;
                if (routes.geometry.type === "MultiLineString" && newIndex < routes.geometry.coordinates.length) {
                    cancelAllAnimationFrames();
                    animationControlRefs.start = 0;
                    animationControlRefs.elapsedTime = 0;
                    animationControlRefs.startTime = 0; // Reset start time for the next segment
                    setCurrentRouteIndex(newIndex);
                    setCurrentPosition(routes.geometry.coordinates[newIndex][0]as Position);
                    animationControlRefs.lastPosition = routes.geometry.coordinates[newIndex][0];
                    return;
                } else {
                    resetAnimationState(true, 4000);
                    updateRouteLayersVisibility(true);
                    return;
                }
            }

            const alongPath = along(route, distanceOfCurrentRoute * animationPhase).geometry.coordinates;
            setCurrentPosition(alongPath);

            animationControlRefs.lastPosition = alongPath;

            if (mapview) {
                const bearing = mapview.getBearing() + 0.12;
                animationControlRefs.bearingRef = bearing;
                const currentView = mapview.getCenter()!;
                const interpolatedView = [
                    lerp(currentView.lng, alongPath[0], 0.05),
                    lerp(currentView.lat, alongPath[1], 0.05)
                ];

                const currentElevation = mapview.queryTerrainElevation(currentView);
                const targetElevation = mapview.queryTerrainElevation(interpolatedView as Position);
                const currentZoomLevel = zoom - ((currentElevation ?? 1) / zoom)*0.001;
                const targetZoomLevel = zoom - ((targetElevation ?? 1) / zoom)*0.001;
                const zoomLevel2 = lerp(currentZoomLevel, targetZoomLevel, 0.45);
                animationControlRefs.zoomRef = zoomLevel2;
                mapview.easeTo({center: interpolatedView as Position, pitch: pitch, bearing: bearing, zoom: zoomLevel2, duration: 0});
                animationFrameIds
                    .current
                    .push(window.requestAnimationFrame(animateFlyAlongRoute));
            }
        }
        if (routes && currentPosition) {
            if (routes.geometry.type === "LineString") {
                handleAnimation(routes as Feature < LineString, Properties >);
            } else if (routes.geometry.type === "MultiLineString") {
                handleAnimation(lineString(routes.geometry.coordinates[currentRouteIndex]), currentRouteIndex);
            }
        }

    }, [currentPosition, animationControlRefs.isPlaying, zoom, pitch, animationControlRefs.zoomRef, speed]);

    const flyToRoute = useCallback(() => {
        if (mapview && currentPosition) {
            executeFlyTo(mapview, currentPosition, 2000, pitch, animationControlRefs.bearingRef, animationControlRefs.startTime, animationControlRefs.zoomRef, zoom);
            setTimeout(() => {
                animationFrameIds
                    .current
                    .push(window.requestAnimationFrame(animateFlyAlongRoute));
            }, 2400);
        }
    }, [isPlaying, currentPosition, mapview, zoom, pitch, speed]);

    useEffect(() => {
        if (currentRouteIndex) {
            if (mapview && currentPosition) {
                const currentElevation = mapview.queryTerrainElevation([currentPosition[0], currentPosition[1]]);
                let currentZoomLevel = zoom - (((currentElevation ?? 1.25) / 1.25) / 13) * 0.01;
                mapview.flyTo({
                    center: [
                        currentPosition[0], currentPosition[1]
                    ],
                    pitch: pitch,
                    bearing: animationControlRefs.bearingRef,
                    duration: 6000,
                    zoom: (animationControlRefs.startTime === 0)
                        ? currentZoomLevel
                        : animationControlRefs.zoomRef
                });
            }
            setTimeout(() => {
                animationFrameIds
                    .current
                    .push(window.requestAnimationFrame(animateFlyAlongRoute));
            }, 6400);
        }
    }, [currentRouteIndex, pitch, mapview, zoom, routes, speed]);

    useEffect(() => {
        if (isPlaying) {
            updateRouteLayersVisibility(false);
            animationControlRefs.startTime = 0;
            flyToRoute();
        }else{
            updateRouteLayersVisibility(true);
        }
    }, [isPlaying]);

    const recordAnimation = useCallback(() => {
        if(recording){
            setRecording(!recording);
            resetAnimationState();
        }else{
            setRecording(!recording);
            startAnimation();
        }
    }, [startAnimation, resetAnimationState, recording]);

    return {startAnimation, stopAnimation, recordAnimation};
};