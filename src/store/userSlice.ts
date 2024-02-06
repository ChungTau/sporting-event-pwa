import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../models/User';

interface UserState {
  user: User | undefined;
}

const initialState: UserState = {
  user: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined; // Set it to undefined to clear the user data
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
