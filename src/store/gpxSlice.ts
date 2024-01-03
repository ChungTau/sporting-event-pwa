import { PayloadAction,                                                                                                                                                                                                                                  createSlice } from "@reduxjs/toolkit";
import { Feature, LineString, Properties } from "@turf/helpers";
import { GpxData } from "../models/GpxData";

export interface GPXState {
  data?: GpxData|undefined;
  route?: Feature<LineString, Properties>;
  isLoading: boolean;
  error?: string;
}

const saveToLocalStorage = (state: GpxData | undefined) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('gpxData', serializedState);
  } catch (e) {
    console.error("Could not save state", e);
  }
};

const initialState: GPXState = {
  isLoading: true,
  error: undefined,
};


// Add cases for loading, success, and failure
const gpxSlice = createSlice({
  name: 'gpx',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
  },
  clearLoading: (state) => {
    state.isLoading = false;
},
    setGPXData: (state, action: PayloadAction<GpxData|undefined>) => {
      state.data = action.payload;
      state.isLoading = false;
      saveToLocalStorage(state.data); 
    },
    clearGPXData: (state) => {
      state.data = undefined;
      state.route = undefined;
      state.isLoading = false;
      state.error = undefined;
      saveToLocalStorage(state.data);
    },
  }
});

export const { setGPXData, clearGPXData } = gpxSlice.actions;


export default gpxSlice.reducer;