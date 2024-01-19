import { Dispatch } from 'redux';
import { setLoggedIn, setToken } from '../store/authSlice';
import api from '../config/api';
import User from '../models/User';
import Credential from '../models/Credential';

const AuthServices = {
  signUp: async (user: User, dispatch: Dispatch) => {
    try {
      const response = await api.post('/signup', user);

      const { token } = response.data;

      localStorage.setItem('token', token);

      dispatch(setLoggedIn(true));
      dispatch(setToken(token));
    } catch (error) {
      console.error('Sign-up failed:', error);
    }
  },

  signIn: async (credentials: Credential, dispatch: Dispatch) => {
    try {
      const response = await api.post('/signIn', credentials);

      const { token } = response.data;

      localStorage.setItem('token', token);

      dispatch(setLoggedIn(true));
      dispatch(setToken(token));
    } catch (error) {
    }
  },

  signOut: (dispatch: Dispatch) => {
    localStorage.removeItem('token');
    dispatch(setLoggedIn(false));
    dispatch(setToken(null));
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/forgotPassword', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password failed:', error);
    }
  },

  resetPassword: async (resetData: { token: string, password: string }) => {
    try {
      const response = await api.post('/resetPassword', resetData);
      return response.data;
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  },
};

export default AuthServices;
