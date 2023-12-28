// MapProvider.tsx
import React, {ReactNode, FC, useRef} from 'react';
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import MapContext from '../contexts/MapContext';

interface MapProviderProps {
    children : ReactNode;
}

export const MapProvider : FC < MapProviderProps > = ({children}) => {
    const mapRef = useRef < mapboxgl.Map > (null);
    return (
        <MapContext.Provider value={mapRef}>
            {children}
        </MapContext.Provider>
    );
};

export default MapProvider;