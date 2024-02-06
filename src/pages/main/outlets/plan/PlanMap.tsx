// Map.js
import React, {useEffect, useCallback, useState, useMemo, Suspense} from 'react';

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
import FallbackSpinner from '../../../../components/FallbackSpinner';

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
    const currentRoute = useMemo(() => gpx.gpxState.data?.routes, [gpx.gpxState.data?.routes]);

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
        if (!map.mapRef.current || !currentRoute ||isStyleLoaded) {
            return;
        }

        map.mapRef.current.getMapInstance().on('style.load',()=>{
            addLayersToMap(map.mapRef, '#887d73', currentRoute);
            return;
        })
        addLayersToMap(map.mapRef, '#887d73', currentRoute);
      }, [currentRoute, map.mapRef, isStyleLoaded]);

      useEffect(() => {
        addLayersIfNeeded();
      }, [addLayersIfNeeded, currentRoute]);
      
      const addMarkerToMap = useCallback((markerData: MarkerData) => {
        if (!map.mapRef.current || !map.mapRef.current.getMapInstance()) {
            return;
        }
    
        const marker = markerData.name === 'Start Point' ? createStartMarker() : markerData.name === 'End Point' ? createFinishMarker() : createCustomMarker();
        marker.setLngLat(markerData.position).addTo(map.mapRef.current.getMapInstance());
        marker.data = markerData;
        map.addMarker(marker);
    }, [map]);

      const createMarkerData = (coord: Position, name: string, distance: number, elevationGain: number, services:string[]=[]): MarkerData => {
        return {
          id: uuidv4(),
          name: name,
          services: services,
          distance: distance,
          distanceInter: distance,
          elevationGain: elevationGain,
          elevation: coord[2],
          position: [coord[0], coord[1]] as Position,
        };
      };
      
/* eslint-disable react-hooks/exhaustive-deps */
      const initializeCheckpoints = useCallback(() => {
        if (!gpx.gpxState.data || !currentRoute || currentRoute.geometry.coordinates.length === 0 || !map.isStyleLoaded) {
            return;
        }
    
        const coordinates = currentRoute.geometry.coordinates;
    
        const waypoints = Array.from(gpx.gpxState.xml?.querySelectorAll('wpt')!);

        const markers = waypoints.map((waypoint, index) => {
            const lat = parseFloat(waypoint.getAttribute("lat")!);
            const lng = parseFloat(waypoint.getAttribute("lon")!);
            const name = waypoint.querySelector("name")?.textContent || `Waypoint ${index + 1}`;
            const servicesElement = waypoint.querySelector("services");
            const services = servicesElement? Array.from(servicesElement.querySelectorAll("service")).map((serviceElement) => serviceElement.textContent): [];
            const nearestPoint = findNearestPointOnRoute({lat, lng}, currentRoute!);
            const newDistance = calculateDistanceAlongRoute(nearestPoint!, currentRoute as RouteFeature);
            const newElevationGain = calculateElevationGainToPoint(currentRoute as RouteFeature, nearestPoint as[number,number]);
            return createMarkerData(nearestPoint as[number,number], name, newDistance, newElevationGain, services.filter(Boolean) as string[]); // Adjust the parameters as needed.
        });

        markers.forEach(addMarkerToMap);

        if (currentRoute.geometry.type === "LineString") {
            const startCoord = coordinates[0];
            const endCoord = coordinates[coordinates.length - 1];
    
            const startPoint = createMarkerData(startCoord as Position, 'Start Point', 0, 0);
            const endPoint = createMarkerData(endCoord as Position, 'End Point', gpx.gpxState.data.info.distance, gpx.gpxState.data.info.climb);
    
            addMarkerToMap(startPoint);
            addMarkerToMap(endPoint);
        }
    
        // Handle MultiLineString
        else if (currentRoute.geometry.type === "MultiLineString") {
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
        if (!currentRoute?.geometry.coordinates) return;
        const mRef = map.mapRef.current.getMapInstance();

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
                        const newDistance = calculateDistanceAlongRoute(nearestPoint, currentRoute as RouteFeature);
                        const newElevationGain = calculateElevationGainToPoint(currentRoute as RouteFeature, nearestPoint as[number,number]);
                        const newElevation = getElevationAtPoint(currentRoute as RouteFeature, nearestPoint);
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
    }, [currentRoute,map,toast]);

    useEffect(() => {
        const mRef = map.mapRef.current;

        if (!mRef) return;
        const mapInstance = mRef.getMapInstance();
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
    }, [map, placePinNearRoute]);

    useEffect(() => {
        const initializeAndSetCheckpoints = () => {
            initializeCheckpoints();
        };

        if (currentRoute) {
            initializeAndSetCheckpoints();
        }
    }, [currentRoute,initializeCheckpoints]);

    const handleResize = useCallback(() => {
        resizeMap(currentRoute, map.mapRef);
    }, [currentRoute,map.mapRef]);

    useEffect(() => {
        if (currentRoute) {
            handleResize();
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentRoute, map.mapRef, handleResize ]);

    const handleModalSubmit = (checkpointData : MarkerData) => {
        if (tempMarker) {
            const lngLat = tempMarker.getLngLat();
            checkpointData.id = uuidv4();
            checkpointData.distance = calculateDistanceAlongRoute([lngLat.lng, lngLat.lat], currentRoute as RouteFeature);
            checkpointData.elevationGain = calculateElevationGainToPoint(currentRoute as RouteFeature, [lngLat.lng, lngLat.lat]);
            checkpointData.elevation = getElevationAtPoint(currentRoute as RouteFeature, [lngLat.lng, lngLat.lat]);

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
      <Suspense fallback={< FallbackSpinner />}>
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
            {currentRoute && <MapPanel />}
            </BaseMap>
      </Suspense>

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
