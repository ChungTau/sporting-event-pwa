import { Dispatch } from 'redux';
import { setLoggedIn, setToken } from '../store/authSlice';
import api from '../config/api';
import User from '../models/User';
import Credential from '../models/Credential';

const AuthServices = {
  signUp: async (user: User) => {
    try {
      const response = await api.post('/user/signUp', user);
      //localStorage.setItem('token', token);
      return response.data.token ? true: false; // Sign-up was successful
    } catch (error) {
      console.error('Sign-up failed:', error);
      return false; // Sign-up failed
    }
  },

  signIn: async (credentials: Credential, dispatch: Dispatch) => {
    try {
      const response = await api.post('/user/signIn', credentials);

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
      const response = await api.post('/user/forgotPassword', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password failed:', error);
    }
  },

  resetPassword: async (password: string) => {
    try {
      const response = await api.post('/user/resetPassword', password);
      return response.data;
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  },
};

export default AuthServices;
