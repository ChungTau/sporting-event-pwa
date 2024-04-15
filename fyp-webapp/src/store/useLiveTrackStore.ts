import { LiveLocation } from "@prisma/client";
import { LngLatLike } from "react-map-gl/dist/esm/types";
import { create } from "zustand";

type LiveTrackDataState = {
    partiMarkers: mapboxgl.Marker[];
    removePartiMarker: (partiMarkerId: string) => void;
    getPartiMarkerById: (partiMarkerId: string) => mapboxgl.Marker | undefined;
    setPartiMarkers: (partiMarkers: mapboxgl.Marker[]) => void;
    addPartiMarker: (newPartiMarker: mapboxgl.Marker) => void;
    updatePartiMarker: (partiMarkerId: string, lngLat: LngLatLike) => void;
    clearPartiMarkers: () => void;
    liveTrackData?: LiveLocation[]|null;
    setLiveTrackData: (liveTrackData: LiveLocation[]|null) => void;
}

export const useLiveTrackStore = create<LiveTrackDataState>((set, get) => ({
    partiMarkers: [],
    removePartiMarker(partiMarkerId) {
        set((state) => {
            const markerToRemove = state.partiMarkers.find(
                (partiMarker) => partiMarker.data?.id === partiMarkerId
            );
    
            if (markerToRemove) {
                // Remove the marker from the map
                markerToRemove.remove();
            }
    
            const updatedMarkers = state.partiMarkers.filter(
                (marker) => marker.data?.id !== partiMarkerId
            );

            return { partiMarkers: updatedMarkers };
        });
    },
    setPartiMarkers: (partiMarkers) => set({partiMarkers}),
    getPartiMarkerById: (partiMarkerId) => {
        const state = get();
        return state.partiMarkers.find(partiMarker => partiMarker.data?.id === partiMarkerId);
    },
    addPartiMarker: (newPartiMarker) => {
        set(state => {
            // Check if the marker already exists to prevent duplicates
            const exists = state.partiMarkers.some(marker => marker === newPartiMarker);
            if (!exists) {
                return { partiMarkers: [...state.partiMarkers, newPartiMarker] };
            }
            return state; // If the marker already exists, return the current state unchanged
        });
    },
    updatePartiMarker: (markerId, lngLat) => {
        set(state => {
            const markers = state.partiMarkers.map(marker => {
                if (marker.data?.id === markerId) {       
                    marker.setLngLat(lngLat);
                }
                return marker;
            });
            return { partiMarkers: markers };
        });
    },
    clearPartiMarkers: () => {
        set((state) => {
            state.partiMarkers.forEach((partiMarker) => {
                partiMarker.remove();
            });
            return { partiMarkers: [] };
        });
    },   
    liveTrackData: null,
    setLiveTrackData: (liveTrackData) => set({ liveTrackData })
}));