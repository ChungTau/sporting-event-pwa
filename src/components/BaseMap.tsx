import React, {useRef, useEffect, forwardRef, useImperativeHandle} from 'react';
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import { terrainRate } from '../constants/map';

// Mapbox token (replace with your own)
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN !;

interface MapProps {
    style?: React.CSSProperties | undefined
    center?: [number, number];
    zoom?: number;
}

export interface MapRef {
    getMapInstance : () => mapboxgl.Map | undefined;
}

const BaseMap = forwardRef < MapRef,
    MapProps > (({
        style,
        center = [
            0, 0
        ],
        zoom = 12
    }, ref) => {
        const mapContainerRef = useRef < HTMLDivElement | null > (null);
        const mapInstance = useRef < mapboxgl.Map > ();
        useEffect(() => {
            mapInstance.current = new mapboxgl.Map({
                container: mapContainerRef.current !,
                center: center,
                zoom: zoom,
                pitch: 50,
                optimizeForTerrain: true
            });

            mapInstance
                .current
                .on('style.load', () => {
                    if (mapInstance.current) {
                        if (!mapInstance.current.getSource('mapbox-dem')) {
                            mapInstance.current
                                ?.addSource('mapbox-dem', {
                                    'type': 'raster-dem',
                                    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                                    'tileSize': 512
                                });
                        }
                        mapInstance
                            .current
                            .setTerrain({'source': 'mapbox-dem', 'exaggeration':terrainRate});
                        if("imports" in mapInstance.current.getStyle()){
                            (mapInstance.current as any).setConfigProperty('basemap', 'lightPreset', 'day');
                            (mapInstance.current as any).setConfigProperty('basemap', 'showPointOfInterestLabels', false);
                            (mapInstance.current as any).setConfigProperty('basemap', 'showTransitLabels', false);
                            (mapInstance.current as any).setConfigProperty('basemap', 'showRoadLabels', false);
                        }
                        
                    }
                });
                
            return () => {
                mapInstance.current
                    ?.remove();
            };
        }, [center, zoom]);

        // Expose methods using the ref
        useImperativeHandle(ref, () => ({
            getMapInstance: () => mapInstance.current
        }));

        return <div ref={mapContainerRef} style={style}/>;
    });

export default BaseMap;