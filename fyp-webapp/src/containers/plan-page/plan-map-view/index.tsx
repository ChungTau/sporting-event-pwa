import MapView from "@/components/mapView";
import { useGpxDataStore } from "@/store/useGpxDataStore";
import { useMapAnimStore } from "@/store/useMapAnimDataStore";
import { MAP_PADDING, addRouteToMap, calculateDistanceAlongRoute, calculateElevationGainToPoint, findNearestPointOnRoute, getElevationAtPoint, removeAllRoutes, resizeMap } from "@/utils/map";
import { useAnimation } from "@/utils/map/useAnimation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl";
import MapControlPanel from "../map-view-panel";
import { MarkerData } from "@/types/mapbox-marker";
import { useMarkerStore } from "@/store/useMarkerStore";
import { createCustomMarker, createFinishMarker, createPartiMarker, createStartMarker } from "./marker";
import { v4 as uuid } from "uuid";

import {
    Position,
    //@ts-ignore
} from '@turf/turf';
import { toast } from "sonner";
import { PlanCheckpointDialog } from "..";
import { useLiveTrackStore } from "@/store/useLiveTrackStore";
import { JsonObject } from "@prisma/client/runtime/library";

function PlanMapView() {
    const {mapview} = useMap();
    const {routes, info, xml, inPage} = useGpxDataStore();
    const [tempMarker,
        setTempMarker] = useState < mapboxgl.Marker | null > (null);

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
    const {addMarkers, updateMarker, clearMarkers} = useMarkerStore();
    const {liveTrackData, partiMarkers, addPartiMarker, getPartiMarkerById, removePartiMarker, updatePartiMarker, clearPartiMarkers} = useLiveTrackStore();
    const [markerData,
        setMarkerData] = useState < MarkerData > ({
        id: '',
        name: '',
        services: [],
        elevation: 0,
        elevationGain: 0,
        distance: 0,
        distanceInter: 0,
        position: null,
        removable: true
    });
    const aspectStyle = useAspectStyle(resolution);
    useEffect(() => {
        if (mapview && routes) {

            const handleStyleLoad = () => {
                removeAllRoutes(mapview);
                
                addRouteToMap(mapview, routes);
                resizeMap(mapview, routes, 2600, inPage === "live" ? {
                    top: 80,
                    bottom: 500,
                    left: 40,
                    right: 40
                }:MAP_PADDING);
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
    }, [mapview, routes, inPage]);

    useEffect(()=>{
        if(liveTrackData && mapview && partiMarkers){

            const map = mapview.getMap();
            liveTrackData.forEach((liveData) => {
                const existingMarker = getPartiMarkerById(liveData.userId);
                if (existingMarker) {
                    // Marker exists, update its position
                    updatePartiMarker(liveData.userId, {lng:((liveData?.coordinates[liveData.coordinates.length -1] as JsonObject)?.longitude as number), lat:((liveData?.coordinates[liveData.coordinates.length -1] as JsonObject)?.latitude as number)});
                    //existingMarker.setLngLat([liveData.longitude, liveData.latitude]);
                } else {
                    // Marker does not exist, create it
                    const partiMarker = createPartiMarker({
                        name: (liveData as any)?.user.name,
                        image: (liveData as any)?.user.image || 'https://github.com/shadcn.png'
                    });
                    partiMarker.setLngLat( {lng:((liveData?.coordinates[liveData.coordinates.length -1] as JsonObject)?.longitude as number), lat:((liveData?.coordinates[liveData.coordinates.length -1] as JsonObject)?.latitude as number)}).addTo(map);
                    partiMarker.data = {
                        id: liveData.userId
                    };
                    addPartiMarker(partiMarker); // Assuming this function adds the marker to your store or state
                }
            });

            partiMarkers.forEach(marker => {
                if (!liveTrackData.some(data => data.userId === marker.data?.id)) {
                    removePartiMarker(marker.data?.id!);
                    marker.remove(); // Remove from the map
                }
            });
        }
    },[liveTrackData]);

    const addMarkerToMap = useCallback((markerData: MarkerData, draggable: boolean = true) => {
        if (!mapview) {
            return;
        }
        const map = mapview.getMap();
        if (!map) {
            return;
        }
        const marker = markerData.name === 'Start Point'
            ? createStartMarker()
            : markerData.name === 'End Point'
                ? createFinishMarker()
                : createCustomMarker(draggable);
        marker
            .setLngLat(markerData.position)
            .addTo(map);
        marker.data = markerData;
        addMarkers(marker);
    }, [mapview, addMarkers]);  // ensure dependencies are correctly listed here
    

    const createMarkerData = (coord : Position, name : string, distance : number, elevationGain : number, services : string[] = [], removable: boolean = true) : MarkerData => {
        return {
            id: uuid(),
            name: name,
            services: services,
            distance: distance,
            distanceInter: distance,
            elevationGain: elevationGain,
            elevation: coord[2],
            position: [coord[0], coord[1]]as Position,
            removable: removable
        };
    };

    const initializeCheckpoints = useCallback(() => {
        if (!routes || routes.geometry.coordinates.length === 0 || !mapview) {
            return;
        }
        clearMarkers();
        clearPartiMarkers();
        const coordinates = routes.geometry.coordinates;
        const waypoints = Array.from(xml
            ?.querySelectorAll('wpt')!);

            const markers = waypoints.map((waypoint, index) => {
                const lat = parseFloat(waypoint.getAttribute("lat")!);
                const lng = parseFloat(waypoint.getAttribute("lon")!);
                const name = waypoint.querySelector("name")
                    ?.textContent || `Waypoint ${index + 1}`;
                const servicesElement = waypoint.querySelector("services");
                const services = servicesElement
                    ? Array
                        .from(servicesElement.querySelectorAll("service"))
                        .map((serviceElement) => serviceElement.textContent)
                    : [];
                const nearestPoint = findNearestPointOnRoute({
                    lat,
                    lng
                }, routes !);
                const newDistance = calculateDistanceAlongRoute(nearestPoint !, routes);
                const newElevationGain = calculateElevationGainToPoint(routes, nearestPoint as[number,
                    number]);
                return createMarkerData(nearestPoint as[number,
                    number], name, newDistance, newElevationGain, services.filter(Boolean)as string[], true); // Adjust the parameters as needed.
            });

            
        markers.forEach((markerData) => addMarkerToMap(markerData, false));
        if (routes.geometry.type === "LineString") {
            const startCoord = coordinates[0];
            const endCoord = coordinates[coordinates.length - 1];
    
            const startPoint = createMarkerData(startCoord as Position, 'Start Point', 0, 0, [],false);
            const endPoint = createMarkerData(endCoord as Position, 'End Point', info?.distance!, info?.climb!, [], false);
    
            addMarkerToMap(startPoint);
            addMarkerToMap(endPoint);
        }
    
        // Handle MultiLineString
        else if (routes.geometry.type === "MultiLineString") {
            const startCoord = coordinates[0][0];
            const endCoord = coordinates[coordinates.length - 1][coordinates[coordinates.length - 1].length - 1];
    
            const startPoint = createMarkerData(startCoord as Position, 'Start Point', 0, 0, [],false);
            const endPoint = createMarkerData(endCoord as Position, 'End Point', info?.distance!, info?.climb!,[], false);
            addMarkerToMap(startPoint);
            addMarkerToMap(endPoint);
        }
    }, [routes, mapview,addMarkerToMap, clearMarkers, clearPartiMarkers, info?.climb, info?.distance, xml]);

    const placePinNearRoute = useCallback((lngLat : Position) => {
        if (!routes.geometry.coordinates) return;
        const mRef = mapview?.getMap();
        if (!mRef) {
            return;
        }
        const nearest = findNearestPointOnRoute(lngLat, routes);
        if (nearest) {
            const newMarker = createCustomMarker().setLngLat(nearest).addTo(mRef).on('dragend', () => {
                    const draggedLngLat = newMarker.getLngLat();
                    const nearestPoint = findNearestPointOnRoute(draggedLngLat, routes!);
                    if (nearestPoint) {
                        newMarker.setLngLat(nearestPoint);

                        // Update new marker's data
                        const newDistance = calculateDistanceAlongRoute(nearestPoint, routes);
                        const newElevationGain = calculateElevationGainToPoint(routes, nearestPoint as[number,number]);
                        const newElevation = getElevationAtPoint(routes, nearestPoint);
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
                        distanceInter: 0,
                        removable:true
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
        }, [routes,mapview, updateMarker]);


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
    
            if (routes) {
                initializeAndSetCheckpoints();
            }
        }, [routes,initializeCheckpoints]);
    

    const handleResize = useCallback(() => {
        resizeMap(mapview, routes, 2600, inPage === "live" ? {
            top: 80,
            bottom: 500,
            left: 40,
            right: 40
        }:MAP_PADDING);
    }, [routes, mapview, inPage]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {

            window.removeEventListener('resize', handleResize);
        };
    }, [routes, mapview, handleResize]);
    useEffect(()=>{
        if(resolution && mapview){
            mapview.resize();
        }
    },[resolution, mapview]);


    function onClose(open: boolean){
        if(!open){
            if(tempMarker){
                tempMarker.remove();
                setTempMarker(null);
            }
            setIsModalOpen(false);
        }
    }

    const handleModalSubmit = (checkpointData : MarkerData) => {
        if (tempMarker) {
            const lngLat = tempMarker.getLngLat();
            checkpointData.id = uuid();
            checkpointData.distance = calculateDistanceAlongRoute([
                lngLat.lng, lngLat.lat
            ], routes);
            checkpointData.elevationGain = calculateElevationGainToPoint(routes, [lngLat.lng, lngLat.lat]);
            checkpointData.elevation = getElevationAtPoint(routes, [lngLat.lng, lngLat.lat])!;

            const newMarkerData = {
                ...checkpointData,
                distanceInter: 0, // Initialize with 0, will be recalculated
            };

            tempMarker.data = newMarkerData;
            // Update MapContext for the temporary marker
            addMarkers(tempMarker); // Add new checkpoint

            setTempMarker(null);
        }
        setMarkerData(checkpointData);
        setIsModalOpen(false);
        console.log(checkpointData);
    };

    return (
        <div className={`m-auto items-center justify-center relative ${inPage === "live" ? "w-full h-full" : `rounded-lg overflow-clip ${aspectStyle}`}`}>
            <MapView>
                {(mapview && inPage !== "live") && <MapControlPanel
                    mapview={mapview}
                    startAnimation={startAnimation}
                    stopAnimation={stopAnimation}
                    recordAnimation={recordAnimation}/>}
            </MapView>
            <PlanCheckpointDialog open={isModalOpen} onClose={onClose} onSubmit={handleModalSubmit} checkpointData={markerData}/>
        </div>
    );
}

export default PlanMapView;