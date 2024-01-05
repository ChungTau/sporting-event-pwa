import { Dispatch, SetStateAction, createContext } from "react";

export interface Info {
    elevationGain: number;
    distance: number;
}

export interface AnimationState {
    pitch: number;
    speed: number;
    zoomLevel: number;
    isPlaying: boolean;
    isRecording: boolean;
    isCompleted: boolean;
    info: Info;
    start: () => void;
    reset: () => void;
    record: ()=> void;
}

export const defaultState: AnimationState = {
    pitch: 0,
    speed: 0,
    zoomLevel: 0,
    isPlaying: false,
    isRecording: false,
    isCompleted: true,
    info: {
        elevationGain: 0,
        distance: 0
    } as Info,
    start: () => { },
    reset: () => { },
    record: ()=> {}
};

export interface AnimationContextProps extends AnimationState {
    setPitch: Dispatch<SetStateAction<number>>;
    setZoomLevel: Dispatch<SetStateAction<number>>;
    setSpeed: Dispatch<SetStateAction<number>>;
}

export const AnimationContext = createContext<AnimationContextProps | null>(null);