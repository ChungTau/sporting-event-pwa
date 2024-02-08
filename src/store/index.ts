import { configureStore } from '@reduxjs/toolkit';
import authenticatedReducer, { setLoggedIn, setToken } from './authSlice';
import userReducer from './userSlice';


const loadTokenFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  return token;
};

const initialToken = loadTokenFromLocalStorage();

const store = configureStore({
  reducer: {
    authenticated: authenticatedReducer,
    user:userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  preloadedState: {
    authenticated: {
      token: initialToken || null,
      isLoggedIn: !!initialToken,
    },
  },
});

if (initialToken) {
  store.dispatch(setToken(initialToken));
  store.dispatch(setLoggedIn(true));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
