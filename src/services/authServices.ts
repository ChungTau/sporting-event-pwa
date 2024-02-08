import { Dispatch } from 'redux';
import { setLoggedIn, setToken } from '../store/authSlice';

import api from '../config/api';
import User from '../models/User';
import Credential from '../models/Credential';

const AuthServices = {
  signUp: async (user: User) => {
    try {
      const response = await api.post('/api/user/signUp', user);
      console.log(response);
      return response.status === 201 ? true : false;
    } catch (error) {
      console.error('Sign-up failed:', error);
      return false; // Sign-up failed
    }
  },

  signIn: async (credentials: Credential, dispatch: Dispatch) => {
    try {
      const response = await api.post('/api/user/signIn', credentials);
      return response;
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  },

  signOut: (dispatch: Dispatch) => {
    localStorage.removeItem('token');
    dispatch(setLoggedIn(false));
    dispatch(setToken(null));
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post(`/api/user/forgotPassword/${email}`);
      return response.data;
    } catch (error) {
      console.error('Forgot password failed:', error);
    }
  },

  resetPassword: async (credentials: Credential ) => {
    try {
      const response = await api.post("/api/user/resetPassword",credentials);
      return response.data;
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  },
};

export default AuthServices;
