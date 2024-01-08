import React, { ReactNode, useEffect, useRef, useState } from 'react';
//@ts-ignore
import mapboxgl from 'mapbox-gl';
import MapContext, { MapContextProps, MarkerData } from '../contexts/MapContext';

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [isStyleLoaded, setIsStyleLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

/* eslint-disable react-hooks/exhaustive-deps */
useEffect(() => {
  const handleStyleLoad = () => {
    setIsStyleLoaded(true);
    setIsLoading(false); // Set loading to false once the style is loaded
  };

  if (mapRef.current) {
    const mapInstance = mapRef.current.getMapInstance();

    // Check if the style is already loaded, set isStyleLoaded to true immediately
    if (mapInstance.isStyleLoaded()) {
      setIsStyleLoaded(true);
      setIsLoading(false);
    } else {
      mapInstance.on('style.load', handleStyleLoad);
    }

    return () => {
      mapInstance.off('style.load', handleStyleLoad);
    };
  }
}, [mapRef.current]);
/* eslint-enable react-hooks/exhaustive-deps */

  const getMarkerById = (markerId: string): mapboxgl.Marker | undefined => {
    return markers.find((marker) => marker.data?.id === markerId);
  };

  const calculateDistanceInter = (markers: mapboxgl.Marker[]) => {
    for (let i = 1; i < markers.length; i++) {
      const prevMarker = markers[i - 1];
      const currentMarker = markers[i];
      const distanceInter =
        currentMarker.data?.distance - prevMarker.data?.distance || 0;
      currentMarker.data = {
        ...currentMarker.data,
        distanceInter: distanceInter,
      };
    }
  };

  const addMarker = (marker: mapboxgl.Marker) => {
    setMarkers((prevMarkers) => {
      const newMarkers = [...prevMarkers, marker];
      newMarkers.sort(
        (a, b) => (a.data?.distance || 0) - (b.data?.distance || 0)
      );
  
      calculateDistanceInter(newMarkers);
      
      return newMarkers;
    });
  };

  const removeMarker = (markerId: string) => {
    setMarkers((prevMarkers) => {
      const markerToRemove = prevMarkers.find(
        (marker) => marker.data?.id === markerId
      );

      if (markerToRemove) {
        // Remove the marker from the map
        markerToRemove.remove();
      }

      const updatedMarkers = prevMarkers.filter(
        (marker) => marker.data?.id !== markerId
      );

      calculateDistanceInter(updatedMarkers);

      return updatedMarkers;
    });
  };

  const updateMarker = (updatedMarkerData: MarkerData) => {
    setMarkers((prevMarkers) => {
      const updatedMarkers = prevMarkers.map((marker, index) => {
        if (marker.data && marker.data.id === updatedMarkerData.id) {
          // Update marker properties in-place
          const newPosition = updatedMarkerData.position || [0, 0];

          // Check if newPosition contains valid values
          const isValidPosition = newPosition.every(
            (coord) => !isNaN(coord)
          );

          if (isValidPosition) {
            marker.setLngLat({ lng: newPosition[0], lat: newPosition[1] });
          } else {
            console.error('Invalid position coordinates:', newPosition);
          }
          marker.data = { ...marker.data, ...updatedMarkerData };
        }
        return marker;
      });

      updatedMarkers.sort(
        (a, b) => (a.data?.distance || 0) - (b.data?.distance || 0)
      );

      calculateDistanceInter(updatedMarkers);

      return updatedMarkers;
    });
  };

  const clearMarkers = () => {
    setMarkers((prevMarkers) => {
      
      prevMarkers.forEach((marker) => {

          marker.remove();
      });
      return [];
    });
  };
  
  
  const contextValue: MapContextProps = {
    mapRef,
    markers,
    getMarkerById,
    setMarkers,
    addMarker,
    removeMarker,
    updateMarker,
    clearMarkers,
    isStyleLoaded,
    isLoading,
  };

  return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>;
};

export default MapProvider;