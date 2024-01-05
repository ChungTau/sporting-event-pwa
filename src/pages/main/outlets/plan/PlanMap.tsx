// Map.js
import React, {useEffect, useCallback, useState} from 'react';

import {
    RouteFeature,
    addLayersToMap,
    calculateDistanceAlongRoute,
    calculateElevationGainToPoint,
    findNearestPointOnRoute,
    getElevationAtPoint,
    removeAllRoutes,
    resizeMap
} from '../../../../helpers/map';
import {MarkerData, useMap} from '../../../../contexts/MapContext';
import {GpxData} from '../../../../models/GpxData';
import {hongKongCoordinates} from '../../../../constants/map';

//@ts-ignore
import mapboxgl from 'mapbox-gl';
//@ts-ignore
import {v4 as uuidv4} from 'uuid';
import createCustomMarker from './PlanMarker';
import {Position} from '@turf/turf';
import {useToast} from '@chakra-ui/react';
import CheckpointModal from './CheckpointModal';
import MapPanel from './MapPanel';

const BaseMap = React.lazy(() => import ('../../../../components/BaseMap'));

interface PlanMapProps {
    data?: GpxData | undefined;
}

const PlanMap = ({data} : PlanMapProps) => {
    const map = useMap();
    const toast = useToast();
    const [tempMarker,
        setTempMarker] = useState < mapboxgl.Marker | null > (null);
    const [isModalOpen,
        setIsModalOpen] = useState < boolean > (false);
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

    useEffect(() => {
        if (map.mapRef.current) {
            const mapInstance = map.mapRef.current.getMapInstance();
            if (mapInstance._fullyLoaded) {
                mapInstance.on('style.load',()=>{
                  addLayersToMap(map.mapRef, '#887d73', data?.routes);
                });
            }
        }
    }, [data?.routes, map.mapRef]);

    const initializeCheckpoints = useCallback(() => {
        if (data && data.routes && data.routes.geometry.coordinates.length > 0) {
            const startCoord = data.routes.geometry.coordinates[0];
            const endCoord = data.routes.geometry.coordinates[data.routes.geometry.coordinates.length - 1];
            
            const startPoint = {
                id: uuidv4(),
                name: 'Start Point',
                description: '',
                services: [],
                distance: 0,
                distanceInter: 0,
                elevationGain: 0,
                elevation: startCoord[2],
                position: [startCoord[0], startCoord[1]]as Position
            } as MarkerData;

            const endPoint = {
                id: uuidv4(),
                name: 'End Point',
                description: '',
                services: [],
                distance: data.info.distance,
                distanceInter: data.info.distance,
                elevationGain: data.info.climb,
                elevation: endCoord[2],
                position: [endCoord[0], endCoord[1]]as Position
            } as MarkerData;

            const startMarker = createCustomMarker().setLngLat([startCoord[0], startCoord[1]]);
            const endMarker = createCustomMarker().setLngLat([endCoord[0], endCoord[1]]);
            startMarker.data = startPoint;
            endMarker.data = endPoint;

            map.addMarker(startMarker);
            map.addMarker(endMarker);
        }
        // eslint-disable-next-line
    }, [data, map.mapRef]);

    const placePinNearRoute = useCallback((lngLat : Position) => {
        if (!data?.routes.geometry.coordinates) return;
        const mRef = map.mapRef.current.getMapInstance();

        if (!mRef) {
            return;
        }
        const nearest = findNearestPointOnRoute(lngLat, data.routes.geometry.coordinates);
        if (nearest) {
            const newMarker = createCustomMarker().setLngLat(nearest).addTo(mRef).on('dragend', () => {
                    const draggedLngLat = newMarker.getLngLat();
                    const nearestPoint = findNearestPointOnRoute(draggedLngLat, data.routes.geometry.coordinates);
                    if (nearestPoint) {
                        newMarker.setLngLat(nearestPoint);

                        // Update new marker's data
                        const newDistance = calculateDistanceAlongRoute(nearestPoint, data?.routes as RouteFeature);
                        const newElevationGain = calculateElevationGainToPoint(data?.routes as RouteFeature, nearestPoint as[number,number]);
                        const newElevation = getElevationAtPoint(data?.routes as RouteFeature, nearestPoint);
                        const updatedMarkerData = {
                            ...newMarker.data,
                            distance: newDistance,
                            elevationGain: newElevationGain,
                            elevation: newElevation,
                            position: nearestPoint
                        };
                        setMarkerData(updatedMarkerData);
                        newMarker.data = updatedMarkerData;

                        map.updateMarker(updatedMarkerData);
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
            toast({title: 'Error', description: 'Marker must be placed near the route', status: 'error', duration: 3000, isClosable: true});
        }
    }, [data?.routes,map,toast]);

    useEffect(() => {
        const mRef = map.mapRef.current.getMapInstance();

        if (!mRef) return;

        const handleDrop = (event : DragEvent) => {
            event.preventDefault();
            const rect = mRef.getCanvas().getBoundingClientRect();
            const coordinates = mRef.unproject([
                event.clientX - rect.left,
                event.clientY - rect.top
            ]);

            placePinNearRoute(coordinates);
        };

        const canvas = mRef.getCanvas();

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
    }, [map, placePinNearRoute]);

    useEffect(() => {
        const initializeAndSetCheckpoints = () => {
            initializeCheckpoints();
        };

        if (data?.routes) {
            initializeAndSetCheckpoints();
        }
    }, [data?.routes,initializeCheckpoints]);

    const handleResize = useCallback(() => {
        console.log(map.mapRef.current.getMapInstance());
        resizeMap(data?.routes, map.mapRef);
    }, [data?.routes,map.mapRef]);

    useEffect(() => {
        if (data?.routes) {
            handleResize();
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [data?.routes,map,handleResize ]);

    useEffect(() => {
        return () => {
            removeAllRoutes(map.mapRef);
            map.clearMarkers(); // Assuming you have a function like clearMarkers in your MapContext
        };
        // eslint-disable-next-line
    }, [data?.routes,map.mapRef]);

    const handleModalSubmit = (checkpointData : MarkerData) => {
        if (tempMarker) {
            const lngLat = tempMarker.getLngLat();
            checkpointData.id = uuidv4();
            checkpointData.distance = calculateDistanceAlongRoute([lngLat.lng, lngLat.lat], data?.routes as RouteFeature);
            checkpointData.elevationGain = calculateElevationGainToPoint(data?.routes as RouteFeature, [lngLat.lng, lngLat.lat]);
            checkpointData.elevation = getElevationAtPoint(data?.routes as RouteFeature, [lngLat.lng, lngLat.lat]);

            const newMarkerData = {
                ...checkpointData,
                distanceInter: 0, // Initialize with 0, will be recalculated
            };

            tempMarker.data = newMarkerData;
            // Update MapContext for the temporary marker
            map.addMarker(tempMarker); // Add new checkpoint

            setTempMarker(null);
        }
        setMarkerData(checkpointData);
        setIsModalOpen(false);
    };

    const handleModalClose = () => {
        if (tempMarker) {
            tempMarker.remove();
            setTempMarker(null);
        }
        setIsModalOpen(false);
    };

    return (
      <>
        <BaseMap 
            ref = {map.mapRef}
            center = {hongKongCoordinates }
            zoom = {17}
            style = {{
                position: 'relative',
                width: '100%',
                height: '430px',
                borderRadius: '12px 12px 0px 0px'
            }}
        >
            {data?.routes && <MapPanel/>}
        </BaseMap>
        <CheckpointModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
            checkpointData={markerData}
        /> 
      </>
    );
};

export default PlanMap;
