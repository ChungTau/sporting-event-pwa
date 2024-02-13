import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../models/User';

// Define the UserState type
interface UserState {
  user: User | undefined;
}

const getUserFromLocalStorage = (): User | undefined => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return undefined;
    }
  }
  return undefined;
};

const initialState: UserState = {
  user: getUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    clearUser: (state) => {
      state.user = undefined;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
