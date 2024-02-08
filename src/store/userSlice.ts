import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const loggedInUser = (state:any) => state.user.user;

export default userSlice.reducer;
