import { configureStore } from '@reduxjs/toolkit';
import authenticatedReducer, { setLoggedIn, setToken } from './authSlice';
import userReducer, { setUser } from './userSlice';

const loadTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

const loadUserFromLocalStorage = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

const initialToken = loadTokenFromLocalStorage();
const initialUser = loadUserFromLocalStorage();

const store = configureStore({
  reducer: {
    authenticated: authenticatedReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  preloadedState: {
    authenticated: {
      token: initialToken || null,
      isLoggedIn: !!initialToken,
    },
    user: {
      user: initialUser || undefined, // Assuming your user state has a 'user' property
    },
  },
});

// Dispatch actions to set token and user if they exist
if (initialToken) {
  store.dispatch(setToken(initialToken));
  store.dispatch(setLoggedIn(true));
}
if (initialUser) {
  store.dispatch(setUser(initialUser));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
