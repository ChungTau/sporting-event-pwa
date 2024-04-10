import { create } from 'zustand';

type MapAnimState = {
  pitch: number;
  zoom: number;
  speed: number;
  isPlaying: boolean;
  resolution:"desktop"|"mobile"|"responsive"|"none";
  setPitch: (pitch: number) => void;
  setZoom: (zoom: number) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setResolution: (resolution: "desktop" | "mobile" | "responsive"|"none") => void;
};

export const useMapAnimStore = create<MapAnimState>((set) => ({
  pitch: 40,
  zoom: 16.2,
  speed: 1,
  isPlaying: false,
  resolution: "responsive",
  setPitch: (pitch) => set({ pitch }),
  setZoom: (zoom) => set({ zoom }),
  setSpeed: (speed) => set({ speed }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setResolution: (resolution: "desktop" | "mobile" | "responsive"|"none") => set({ resolution }),
}));