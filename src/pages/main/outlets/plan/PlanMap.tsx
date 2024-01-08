// Map.js
import React, {useEffect, useCallback, useState} from 'react';

import {
    RouteFeature,
    addLayersToMap,
    calculateDistanceAlongRoute,
    calculateElevationGainToPoint,
    findNearestPointOnRoute,
    getElevationAtPoint,
    resizeMap
} from '../../../../helpers/map';
import {MarkerData, useMap} from '../../../../contexts/MapContext';
import {hongKongCoordinates} from '../../../../constants/map';

//@ts-ignore
import mapboxgl from 'mapbox-gl';
//@ts-ignore
import {v4 as uuidv4} from 'uuid';
import {createCustomMarker, createFinishMarker, createStartMarker} from './PlanMarker';
import {Position} from '@turf/turf';
import {useToast} from '@chakra-ui/react';
import CheckpointModal from './CheckpointModal';
import MapPanel from './MapPanel';
import { useGPX } from '../../../../contexts/GPXContext';

const BaseMap = React.lazy(() => import ('../../../../components/BaseMap'));

const PlanMap = () => {
    const map = useMap();
    const gpx = useGPX();
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

    const [isStyleLoaded, setIsStyleLoaded] = useState < boolean > (false);

    useEffect(()=>{
        if(map.mapRef.current){
            const mapInstance = map.mapRef.current.getMapInstance();
            if(mapInstance.isStyleLoaded()){
                setIsStyleLoaded(true);
            }
        }
    },[map.mapRef]);

    const addLayersIfNeeded = useCallback(() => {
        if (!map.mapRef.current || !gpx.gpxState.data?.routes ||isStyleLoaded) {
            return;
        }

        map.mapRef.current.getMapInstance().once('style.load',()=>{
            addLayersToMap(map.mapRef, '#887d73', gpx.gpxState.data?.routes);
            return;
        })
        addLayersToMap(map.mapRef, '#887d73', gpx.gpxState.data?.routes);
      }, [gpx.gpxState.data?.routes, map.mapRef, isStyleLoaded]);

      useEffect(() => {

        addLayersIfNeeded();
      }, [addLayersIfNeeded, gpx.gpxState.data?.routes]);
      
      const addMarkerToMap = useCallback((markerData: MarkerData) => {
        if (!map.mapRef.current || !map.mapRef.current.getMapInstance()) {
            return;
        }
    
        const marker = markerData.name === 'Start Point' ? createStartMarker() : createFinishMarker();
        marker.setLngLat(markerData.position).addTo(map.mapRef.current.getMapInstance());
        marker.data = markerData;
        map.addMarker(marker);
    }, [map]);

      const createMarkerData = (coord: Position, name: string, distance: number, elevationGain: number): MarkerData => {
        return {
          id: uuidv4(),
          name: name,
          services: [],
          distance: distance,
          distanceInter: distance,
          elevationGain: elevationGain,
          elevation: coord[2],
          position: [coord[0], coord[1]] as Position,
        };
      };
      
/* eslint-disable react-hooks/exhaustive-deps */
      const initializeCheckpoints = useCallback(() => {
        if (!gpx.gpxState.data || !gpx.gpxState.data.routes || gpx.gpxState.data.routes.geometry.coordinates.length === 0 || !map.isStyleLoaded) {
            return;
        }
    
        const coordinates = gpx.gpxState.data.routes.geometry.coordinates;
    
        if (gpx.gpxState.data.routes.geometry.type === "LineString") {
            const startCoord = coordinates[0];
            const endCoord = coordinates[coordinates.length - 1];
    
            const startPoint = createMarkerData(startCoord as Position, 'Start Point', 0, 0);
            const endPoint = createMarkerData(endCoord as Position, 'End Point', gpx.gpxState.data.info.distance, gpx.gpxState.data.info.climb);
    
            addMarkerToMap(startPoint);
            addMarkerToMap(endPoint);
        }
    
        // Handle MultiLineString
        else if (gpx.gpxState.data.routes.geometry.type === "MultiLineString") {
            const startCoord = coordinates[0][0];
            const endCoord = coordinates[coordinates.length - 1][coordinates[coordinates.length - 1].length - 1];
    
            const startPoint = createMarkerData(startCoord as Position, 'Start Point', 0, 0);
            const endPoint = createMarkerData(endCoord as Position, 'End Point', gpx.gpxState.data.info.distance, gpx.gpxState.data.info.climb);
            addMarkerToMap(startPoint);
            addMarkerToMap(endPoint);
        }
    }, [gpx.gpxState.data, map.isStyleLoaded]);
      /* eslint-enable react-hooks/exhaustive-deps */
      

    const placePinNearRoute = useCallback((lngLat : Position) => {
        if (!gpx.gpxState.data?.routes.geometry.coordinates) return;
        const mRef = map.mapRef.current.getMapInstance();

        if (!mRef) {
            return;
        }
        const nearest = findNearestPointOnRoute(lngLat, gpx.gpxState.data.routes);
        if (nearest) {
            const newMarker = createCustomMarker().setLngLat(nearest).addTo(mRef).on('dragend', () => {
                    const draggedLngLat = newMarker.getLngLat();
                    const nearestPoint = findNearestPointOnRoute(draggedLngLat, gpx.gpxState.data?.routes!);
                    if (nearestPoint) {
                        newMarker.setLngLat(nearestPoint);

                        // Update new marker's data
                        const newDistance = calculateDistanceAlongRoute(nearestPoint, gpx.gpxState.data?.routes as RouteFeature);
                        const newElevationGain = calculateElevationGainToPoint(gpx.gpxState.data?.routes as RouteFeature, nearestPoint as[number,number]);
                        const newElevation = getElevationAtPoint(gpx.gpxState.data?.routes as RouteFeature, nearestPoint);
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
    }, [gpx.gpxState.data?.routes,map,toast]);

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

        if (gpx.gpxState.data?.routes) {
            initializeAndSetCheckpoints();
        }
    }, [gpx.gpxState.data?.routes,initializeCheckpoints]);

    const handleResize = useCallback(() => {
        resizeMap(gpx.gpxState.data?.routes, map.mapRef);
    }, [gpx.gpxState.data?.routes,map.mapRef]);

    useEffect(() => {
        if (gpx.gpxState.data?.routes) {
            handleResize();
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [gpx.gpxState.data?.routes, map.mapRef, handleResize ]);

    const handleModalSubmit = (checkpointData : MarkerData) => {
        if (tempMarker) {
            const lngLat = tempMarker.getLngLat();
            checkpointData.id = uuidv4();
            checkpointData.distance = calculateDistanceAlongRoute([lngLat.lng, lngLat.lat], gpx.gpxState.data?.routes as RouteFeature);
            checkpointData.elevationGain = calculateElevationGainToPoint(gpx.gpxState.data?.routes as RouteFeature, [lngLat.lng, lngLat.lat]);
            checkpointData.elevation = getElevationAtPoint(gpx.gpxState.data?.routes as RouteFeature, [lngLat.lng, lngLat.lat]);

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
        {gpx.gpxState.data?.routes && <MapPanel />}
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
