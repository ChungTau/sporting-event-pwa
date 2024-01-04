import React, { createContext, useContext, Dispatch, SetStateAction } from 'react';
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import { Position } from '@turf/turf';

export interface MarkerData {
  id: string;
  name: string;
  description: string;
  services: string[];
  distance: number;
  elevationGain: number;
  elevation: number | Position| null;
  distanceInter: number;
  position: Position | null;
}
export interface MapContextProps {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  markers: mapboxgl.Marker[];
  setMarkers: Dispatch<SetStateAction<mapboxgl.Marker[]>>;
  addMarker: (marker: mapboxgl.Marker) => void;
  removeMarker: (marker: mapboxgl.Marker) => void;
  updateMarker: (updatedMarkerData: MarkerData) => void;
  clearMarkers: () => void;
  getMarkerById: (markerId: string) => mapboxgl.Marker | undefined ;
}

const MapContext = createContext<MapContextProps | null>(null);

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