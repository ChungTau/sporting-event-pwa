// MapContext.js
import React, {createContext, useContext} from 'react';
//@ts-ignore
import mapboxgl from 'mapbox-gl';

const MapContext = createContext < React.RefObject < mapboxgl.Map > | null > (null);

// Now export the context so it can be imported elsewhere.
export default MapContext;

// You also export the hook for convenience:
export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMap must be used within a MapProvider that provides a ref to a map instance.');
    }
    return context;
};