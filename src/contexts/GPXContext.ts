// GPXContext.tsx
import {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
  } from 'react';
  import { Feature, LineString, Properties } from '@turf/helpers';

  import  GpxData  from '../models/GpxData';
  
  export interface GPXState {
    data?: GpxData | undefined;
    route?: Feature<LineString, Properties>;
    isLoading: boolean;
    error?: string;
  }
  
  export interface GPXContextProps {
    gpxState: GPXState;
    setGPXState: Dispatch<SetStateAction<GPXState>>;
    setLoading: () => void;
    clearLoading: () => void;
    setGPXData: (data: GpxData | undefined) => void;
    clearGPXData: () => void;
  }
  
  const GPXContext = createContext<GPXContextProps | null>(null);
  
  export default GPXContext;
  
  export const useGPX = () => {
    const context = useContext(GPXContext);
  
    if (!context) {
      throw new Error(
        'useGPX must be used within a GPXProvider that provides GPX state.'
      );
    }
  
    return context;
  };