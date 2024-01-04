import styled from "@emotion/styled";
import BaseMap from "../../../../components/BaseMap";
import {Box} from "@chakra-ui/react";
import {hongKongCoordinates} from "../../../../constants/map";
import {useMap} from "../../../../contexts/MapContext";
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {useEffect, useRef, useState} from "react";
import {AnimatePresence} from "framer-motion";
import { DetailsBox, PointDetails } from "./DetailsBox";


const MapContainer = styled(Box)({width: '100%', height: '650px'});

interface LocationSelectorProps {
    onPointDetailsUpdate: (details: PointDetails) => void;
  }
  
  export const LocationSelector: React.FC<LocationSelectorProps> = ({ onPointDetailsUpdate }) => {
    const map = useMap();
    const markerRef = useRef < mapboxgl.Marker | null > (null);
    const [showDetailBox,
        setShowDetailBox] = useState(false);
    const [pointDetails,
        setPointDetails] = useState<PointDetails>({lng: 0, lat: 0, address: '', name: ''});
    useEffect(() => {
        const mapInstance = map.mapRef.current
            ?.getMapInstance();

        if (mapInstance) {
            mapInstance.on('dragstart', () => {
                mapInstance.getCanvas().style.cursor = 'move';
            });
            mapInstance.on('dragend', () => {
                mapInstance.getCanvas().style.cursor = 'initial';
            });
            mapInstance.on('click', (event : mapboxgl.MapMouseEvent) => {

                const {lng, lat} = event.lngLat;

                if (!markerRef.current) {
                    markerRef.current = new mapboxgl
                        .Marker()
                        .setLngLat([lng, lat])
                        .addTo(mapInstance);
                } else {
                    markerRef
                        .current
                        .setLngLat([lng, lat]);
                }

                mapInstance.flyTo({
                    center: [
                        lng, lat
                    ],
                    zoom:18,
                    essential: true 
                });

                
                fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
                    .then(response => response.json())
                    .then(data => {
                        const result = {
                            lng,
                            lat,
                            address: data.features[0]
                                ?.place_name || 'Unknown location',
                            name: data.features[0]
                                ?.text || 'Unknown location'
                        } as PointDetails;
                        setPointDetails(result);
        onPointDetailsUpdate(result);
                        setShowDetailBox(true);
                    })
                    .catch(error => console.error('Error:', error));
            });
        }
        return () => {
            if (markerRef.current) {
                markerRef
                    .current
                    .remove();
            }
        };
    }, [map.mapRef, onPointDetailsUpdate]);

    return (
        <MapContainer
            style={{
            position: 'relative',
            height: '400px',
            overflow: 'hidden',
        }}>
            <BaseMap
                ref={map.mapRef}
                center={hongKongCoordinates}
                zoom={17}
                style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                borderRadius: 12,
            }}/>
            <AnimatePresence>
                {showDetailBox && (
                    <DetailsBox lng={pointDetails.lng} lat={pointDetails.lat} address={pointDetails.address} name={pointDetails.name} />
                )}
            </AnimatePresence>
        </MapContainer>
    );
};
