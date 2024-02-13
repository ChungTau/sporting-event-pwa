import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
}

const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('token');
};

const initialState: AuthState = {
  isLoggedIn: !!getTokenFromLocalStorage(), // Will be true if there is a token
  token: getTokenFromLocalStorage(), // Fetch the token from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
        state.isLoggedIn = false;
      }
    },
    clearUserData: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setLoggedIn, setToken, clearUserData } = authSlice.actions;

export default authSlice.reducer;
