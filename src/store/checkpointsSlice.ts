import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Position } from '@turf/turf';

export interface CheckpointData {
    id: string;
    name: string;
    description: string;
    services: string[];
    distance: number;
    elevationGain: number;
    elevation: number | Position| null;
    distanceInter: number;
}

interface CheckpointsState {
    checkpoints: CheckpointData[];
}

const initialState: CheckpointsState = {
    checkpoints: [],
};

const checkpointsSlice = createSlice({
    name: 'checkpoints',
    initialState,
    reducers: {
        addCheckpoint: (state, action: PayloadAction<CheckpointData>) => {
            state.checkpoints.push(action.payload);
            // Sort checkpoints by distance
            state.checkpoints.sort((a, b) => a.distance - b.distance);
        },
        updateCheckpoint: (state, action: PayloadAction<CheckpointData>) => {
            const index = state.checkpoints.findIndex(cp => cp.id === action.payload.id);
            if (index !== -1) {
                state.checkpoints[index] = action.payload;
                state.checkpoints.sort((a, b) => a.distance - b.distance); // Sort after update
            }
        },
        clearCheckpoints: (state) =>{
            state.checkpoints = [];
        }
        // Add other reducers as needed
    },
});

export const { addCheckpoint, updateCheckpoint, clearCheckpoints } = checkpointsSlice.actions;

export default checkpointsSlice.reducer;
