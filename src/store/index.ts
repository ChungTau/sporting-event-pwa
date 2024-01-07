import { configureStore } from '@reduxjs/toolkit';
import authenticatedReducer from './authSlice';

const store = configureStore({
  reducer: {
    authenticated: authenticatedReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
