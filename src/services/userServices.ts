import api from '../config/api';
import { Dispatch } from 'redux';
import { setUser, clearUser } from '../store/userSlice';

const UserServices = {
  fetchUserById: async (userId: number) => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserById: async (userId: number, userData: any) => {
    try {
      const response = await api.put(`/api/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUserById: async (userId: number, dispatch: Dispatch) => {
    try {
      await api.delete(`/api/users/${userId}`);
      dispatch(clearUser());
    } catch (error) {
      throw error;
    }
  },
};

export default UserServices;
