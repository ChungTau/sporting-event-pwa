// helpers/apiHelpers.ts
import axiosInstance from '../config/api';

export const get = async <T>(url: string): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const post = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const del = async (url: string): Promise<void> => {
  try {
    await axiosInstance.delete(url);
  } catch (error) {
    throw error;
  }
};
