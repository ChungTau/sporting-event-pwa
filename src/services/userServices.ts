import api from '../config/api';
import { Dispatch } from 'redux';
import { clearUser } from '../store/userSlice';
import User from '../models/User'



const UserServices = {
  getAllUser: async () => {
    try {
      const response = await api.get(`/api/user/getAllUser`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserByEmail: async (data: any) => {
    try {
      const response = await api.post(`/api/user/getUserByEmail`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  saveProfilePic: async (profilePicFormData: any) => {
    try {
      await api.post(`/api/user/saveProfilePic`, profilePicFormData);
    } catch (error) {
      throw error;
    }
  },

  updateMyProfile: async (user: User) => {
    try {
      const response = await api.put(`/api/user/updateMyProfile`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (email: string, dispatch: Dispatch) => {
    try {
       await api.delete(`/api/user/${email}`);
      dispatch(clearUser());
    } catch (error) {
      throw error;
    }
  },
};

export default UserServices;
