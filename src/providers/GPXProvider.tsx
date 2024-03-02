import { ReactNode, useState } from "react";
import  GpxData  from "../models/GpxData";
import GPXContext, { GPXContextProps, GPXState } from "../contexts/GPXContext";

// GPXProvider.tsx
interface GPXProviderProps {
    children: ReactNode;
  }
  
  export const GPXProvider: React.FC<GPXProviderProps> = ({ children }) => {
    const [gpxState, setGPXState] = useState<GPXState>({
      isLoading: true,
      error: undefined,
    });
  
    const setLoading = () => {
      setGPXState((prevState) => ({
        ...prevState,
        isLoading: true,
      }));
    };
  
    const clearLoading = () => {
      setGPXState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    };
  
    const setGPXData = (data: GpxData | undefined) => {
      setGPXState((prevState) => ({
        ...prevState,
        data,
        isLoading: false,
      }));
    };

    const setGPXXML = (xml: Document | undefined) => {
      setGPXState((prevState) => ({
        ...prevState,
        xml,
      }));
    }
  
    const clearGPXData = () => {
      setGPXState({
        isLoading: false,
        error: undefined,
      });
    };
  
    const contextValue: GPXContextProps = {
      gpxState,
      setGPXState,
      setLoading,
      clearLoading,
      setGPXData,
      setGPXXML,
      clearGPXData,
    };
  
    return <GPXContext.Provider value={contextValue}>{children}</GPXContext.Provider>;
  };