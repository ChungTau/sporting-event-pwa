import React, {useEffect} from 'react';
import Map, {Layer, useMap} from 'react-map-gl';
import type {SkyLayer}
from 'react-map-gl';
import {motion} from 'framer-motion';
import {LoadingSpinner} from '../animation/loadingSpinner';
import {cn} from "@/lib/utils";
import {terrainRate} from '@/utils/map';
import { ChildrenProps } from '@/types/childrenProps';

const skyLayer : SkyLayer = {
    id: 'sky',
    type: 'sky',
    paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [
            0.0, 0.0
        ],
        'sky-atmosphere-sun-intensity': 15
    }
};

const initialViewState = {
    longitude: 114.26301200300497,
    latitude: 22.33749430788399,
    zoom: 8,
    pitch: 45
};

export default function MapView({children}:ChildrenProps) {
    const {mapview} = useMap();

    useEffect(() => {
        if (mapview) {
            mapview.on('load', () => {

                const map = mapview.getMap();
                if (!map.getSource('mapbox-dem')) {
                    map.addSource('mapbox-dem', {
                        'type': 'raster-dem',
                        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                        'tileSize': 512
                    });
                }
                map.setTerrain({'source': 'mapbox-dem', 'exaggeration': terrainRate});
            });
        }
    }, [mapview]);
    return (
        <div className="relative w-full h-full">
            <motion.div
                animate={{
                opacity: mapview
                    ?.isStyleLoaded
                        ? 0
                        : 1
            }}
                transition={{
                delay: 0.4,
                duration: 0.4
            }}
                className={cn('absolute inset-0 w-full h-full dark:bg-zinc-900 bg-gray-400 z-[51] items-center ' +
                    'justify-center m-auto', {
                'pointer-events-none': mapview
                    ?.isStyleLoaded
            })}>
                <LoadingSpinner/>
            </motion.div>
            <Map
                id='mapview'
                reuseMaps
                initialViewState={initialViewState}
                style={{
                width: "100%",
                height: "100%"
            }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                optimizeForTerrain>
                <Layer {...skyLayer}/>
                {children}
            </Map>
        </div>
    );
}