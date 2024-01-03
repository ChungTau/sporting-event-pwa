import { configureStore } from '@reduxjs/toolkit';
import authenticatedReducer from './authSlice';
import gpxReducer, { GPXState } from './gpxSlice';
import checkpointsReducer from './checkpointsSlice';
import { GpxData } from '../models/GpxData';

const loadFromLocalStorage = (): GPXState => {
  try {
    const serializedState = localStorage.getItem('gpxData');
    if (serializedState === null) {
   
      return { data: undefined, isLoading: false, error: undefined }; 
    }
   
    const loadedData: GpxData = JSON.parse(serializedState);

    return {
      data: loadedData, 
      isLoading: false, 
      error: undefined, 
    };
  } catch (error : any) {
    console.error("Could not load state", error);
    return { data: undefined, isLoading: false, error: error.toString() };
  }
};

const store = configureStore({
  reducer: {
    gpx: gpxReducer,
    authenticated: authenticatedReducer,
    checkpoints: checkpointsReducer,
  },
  preloadedState: {
    gpx: loadFromLocalStorage(),
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
