import MapView from "@/components/mapView";
import { useGpxDataStore } from "@/store/useGpxDataStore";
import { useMapAnimStore } from "@/store/useMapAnimDataStore";
import { addRouteToMap, calculateDistanceAlongRoute, calculateElevationGainToPoint, findNearestPointOnRoute, getElevationAtPoint, removeAllRoutes, resizeMap } from "@/utils/map";
import { useAnimation } from "@/utils/map/useAnimation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl";
import MapControlPanel from "../map-view-panel";
import { MarkerData } from "@/types/mapbox-marker";
import { useMarkerStore } from "@/store/useMarkerStore";
import { createCustomMarker, createFinishMarker, createStartMarker } from "./marker";
import { v4 as uuid } from "uuid";

import {
    Position,
    //@ts-ignore
} from '@turf/turf';
import { toast } from "sonner";

function PlanMapView() {
    const {mapview} = useMap();
    const {routes, info} = useGpxDataStore();
    const [tempMarker,
        setTempMarker] = useState < mapboxgl.Marker | null > (null);
    const currentRoute = routes;
    function useAspectStyle(resolution:'desktop'|'mobile'|'responsive'|"none") {
        return useMemo(() => {
            switch (resolution) {
                case 'desktop':
                    // For desktop, fix height at 500px and calculate width using 16:9 ratio
                    return "h-[500px] w-[888px]"; // Width is height * (16 / 9)
                case 'mobile':
                    // For mobile, use the 430:932 ratio
                    return "h-[932px] w-[430px]";
                case 'responsive':
                case "none":
                default:
                    // For responsive, use full width and height
                    return "h-[500px] w-full";
            }
        }, [resolution]);
    }
    const [isModalOpen,
        setIsModalOpen] = useState < boolean > (false);
    const {startAnimation, stopAnimation, recordAnimation} = useAnimation(routes, mapview);
    const {resolution} = useMapAnimStore();
    const {addMarkers, updateMarker, setMarkers} = useMarkerStore();
    const [markerData,
        setMarkerData] = useState < MarkerData > ({
        id: '',
        name: '',
        services: [],
        elevation: 0,
        elevationGain: 0,
        distance: 0,
        distanceInter: 0,
        position: null
    });
    const aspectStyle = useAspectStyle(resolution);
    useEffect(() => {
        if (mapview && currentRoute) {

            const handleStyleLoad = () => {
                removeAllRoutes(mapview);
                addRouteToMap(mapview, currentRoute);
                resizeMap(mapview, currentRoute);
            };

            if (mapview.isStyleLoaded()) {
                handleStyleLoad();
            } else {
                mapview.once('styledata', handleStyleLoad);
            }

            return () => {
                mapview.off('styledata', handleStyleLoad);
            };
        }
    }, [mapview, currentRoute]);

    const addMarkerToMap = (markerData: MarkerData) => {
        if (!mapview) {
            return;
        }
        const map = mapview.getMap();
        if(!map){
            return;
        }
        const marker = markerData.name === 'Start Point' ? createStartMarker() : createFinishMarker();
        marker.setLngLat(markerData.position).addTo(map);
        marker.data = markerData;
        addMarkers(marker);
    };

    const createMarkerData = (coord: Position, name: string, distance: number, elevationGain: number): MarkerData => {
        return {
          id: uuid(),
          name: name,
          services: [],
          distance: distance,
          distanceInter: distance,
          elevationGain: elevationGain,
          elevation: coord[2],
          position: [coord[0], coord[1]] as Position,
        };
      };

    const initializeCheckpoints = useCallback(() => {
        if (!routes || routes.geometry.coordinates.length === 0 || !mapview) {
            return;
        }
    
        const coordinates = currentRoute.geometry.coordinates;
    
        if (currentRoute.geometry.type === "LineString") {
            const startCoord = coordinates[0];
            const endCoord = coordinates[coordinates.length - 1];
    
            const startPoint = createMarkerData(startCoord as Position, 'Start Point', 0, 0);
            const endPoint = createMarkerData(endCoord as Position, 'End Point', info?.distance!, info?.climb!);
    
            addMarkerToMap(startPoint);
            addMarkerToMap(endPoint);
        }
    
        // Handle MultiLineString
        else if (currentRoute.geometry.type === "MultiLineString") {
            const startCoord = coordinates[0][0];
            const endCoord = coordinates[coordinates.length - 1][coordinates[coordinates.length - 1].length - 1];
    
            const startPoint = createMarkerData(startCoord as Position, 'Start Point', 0, 0);
            const endPoint = createMarkerData(endCoord as Position, 'End Point', info?.distance!, info?.climb!);
            addMarkerToMap(startPoint);
            addMarkerToMap(endPoint);
        }
    }, [routes, mapview]);

    const placePinNearRoute = useCallback((lngLat : Position) => {
        if (!routes.geometry.coordinates) return;
        const mRef = mapview?.getMap();
        if (!mRef) {
            return;
        }
        const nearest = findNearestPointOnRoute(lngLat, currentRoute);
        if (nearest) {
            const newMarker = createCustomMarker().setLngLat(nearest).addTo(mRef).on('dragend', () => {
                    const draggedLngLat = newMarker.getLngLat();
                    const nearestPoint = findNearestPointOnRoute(draggedLngLat, currentRoute!);
                    if (nearestPoint) {
                        newMarker.setLngLat(nearestPoint);

                        // Update new marker's data
                        const newDistance = calculateDistanceAlongRoute(nearestPoint, currentRoute);
                        const newElevationGain = calculateElevationGainToPoint(currentRoute, nearestPoint as[number,number]);
                        const newElevation = getElevationAtPoint(currentRoute, nearestPoint);
                        const updatedMarkerData = {
                            ...newMarker.data,
                            distance: newDistance,
                            elevationGain: newElevationGain,
                            elevation: newElevation,
                            position: nearestPoint
                        };
                        setMarkerData(updatedMarkerData as MarkerData);
                        newMarker.data = updatedMarkerData as MarkerData;

                        updateMarker(updatedMarkerData as MarkerData);
                    }
                });
                setMarkerData((prev) => ({
                    ...prev,
                    ...(newMarker.data ?? {
                        id: '',
                        name: '',
                        description: '',
                        services: [],
                        elevation: 0,
                        elevationGain: 0,
                        distance: 0,
                        distanceInter: 0
                    }),
                    position: [
                        (lngLat as any).lng,
                        (lngLat as any).lat
                    ]
                }));
                setTempMarker(newMarker);
                setIsModalOpen(true);
                return newMarker; // Add this line to return the newMarker
            } else {
                toast('Error', {description: 'Marker must be placed near the route', duration: 3000});
            }
        }, [routes,mapview]);


        useEffect(() => {

            if (!mapview) return;
            const mapInstance = mapview.getMap();
            const handleDrop = (event : DragEvent) => {
                event.preventDefault();
                const rect = mapInstance.getCanvas().getBoundingClientRect();
                const coordinates = mapInstance.unproject([
                    event.clientX - rect.left,
                    event.clientY - rect.top
                ]);
    
                placePinNearRoute(coordinates);
            };
    
            const canvas = mapInstance.getCanvas();
    
            if (canvas) {
                canvas.addEventListener('drop', handleDrop);
                canvas.addEventListener('dragover', (event : DragEvent) => event.preventDefault());
            }
    
            return () => {
                if (canvas) {
                    canvas.removeEventListener('drop', handleDrop);
                    canvas.removeEventListener('dragover', (event : DragEvent) => event.preventDefault());
                }
            };
        }, [mapview, placePinNearRoute]);

        useEffect(() => {
            const initializeAndSetCheckpoints = () => {
                initializeCheckpoints();
            };
    
            if (currentRoute) {
                initializeAndSetCheckpoints();
            }
        }, [currentRoute,initializeCheckpoints]);
    

    const handleResize = useCallback(() => {
        resizeMap(mapview, currentRoute);
    }, [currentRoute, mapview]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {

            window.removeEventListener('resize', handleResize);
        };
    }, [currentRoute, mapview, handleResize]);
    useEffect(()=>{
        if(resolution && mapview){
            mapview.resize();
        }
    },[resolution, mapview]);
    return (
        <div className={`m-auto items-center justify-center rounded-lg overflow-clip relative ${aspectStyle}`}>
            <MapView>
                {mapview && <MapControlPanel
                    mapview={mapview}
                    startAnimation={startAnimation}
                    stopAnimation={stopAnimation}
                    recordAnimation={recordAnimation}/>}
            </MapView>
        </div>
    );
}

export default PlanMapView;