import { MarkerData } from "@/types/mapbox-marker";
import { calculateDistanceInter } from "@/utils/map";
import mapboxgl from "mapbox-gl";
import { create } from "zustand";


type MarkerDataState = {
    markers: mapboxgl.Marker[];
    data: MarkerData|null;
    setMarkers: (markers: mapboxgl.Marker[]) => void;
    addMarkers: (markers: mapboxgl.Marker) => void;
    removeMarker: (markerId: string) => void;
    updateMarker: (updatedMarkerData: MarkerData) => void;
    clearMarkers: () => void;
    setData: (data: MarkerData) => void;
}
  
export const useMarkerStore = create<MarkerDataState>((set) => ({
    data: null,
    markers: [],
    setMarkers: (markers) => set({markers}),
    addMarkers: (newMarker) => {
        set((state) => {
            const combinedMarkers = [...state.markers, newMarker];
            combinedMarkers.sort((a, b) => (a.data?.distance || 0) - (b.data?.distance || 0));
            calculateDistanceInter(combinedMarkers);
            return { markers: combinedMarkers };
        });
    },
    removeMarker(markerId) {
        set((state) => {
            const markerToRemove = state.markers.find(
                (marker) => marker.data?.id === markerId
            );
    
            if (markerToRemove) {
                // Remove the marker from the map
                markerToRemove.remove();
            }
    
            const updatedMarkers = state.markers.filter(
                (marker) => marker.data?.id !== markerId
            );
    
            calculateDistanceInter(updatedMarkers);
    
            return { markers: updatedMarkers };
        });
    },
    updateMarker(updatedMarkerData) {
        set((state) => {
            const updatedMarkers = state.markers.map((marker) => {
                if (marker.data && marker.data.id === updatedMarkerData.id) {
                    // Update marker properties in-place
                    const newPosition = updatedMarkerData.position || [0, 0];
    
                    // Check if newPosition contains valid values
                    const isValidPosition = newPosition.every((coord:any) => !isNaN(coord));
    
                    if (isValidPosition) {
                        marker.setLngLat({ lng: newPosition[0], lat: newPosition[1] });
                    } else {
                        console.error('Invalid position coordinates:', newPosition);
                    }
                    marker.data = { ...marker.data, ...updatedMarkerData };
                }
                return marker;
            });
    
            updatedMarkers.sort((a, b) => (a.data?.distance || 0) - (b.data?.distance || 0));
    
            calculateDistanceInter(updatedMarkers);
    
            return { markers: updatedMarkers };
        });
    },
    clearMarkers: () => {
        set((state) => {
            state.markers.forEach((marker) => {
                marker.remove();
            });
            return { markers: [] };
        });
    },    
    setData: (data) => set({data}),
}));