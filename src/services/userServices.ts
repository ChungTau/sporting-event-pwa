import api from '../config/api';
import { Dispatch } from 'redux';
import { setUser, clearUser } from '../store/userSlice';

export const fetchUserById = async (userId: number) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserById = async (userId: number, userData: any) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserById = async (userId: number, dispatch: Dispatch) => {
  try {
    await api.delete(`/api/users/${userId}`);
    dispatch(clearUser());
  } catch (error) {
    throw error;
  }
};
