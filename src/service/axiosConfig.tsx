import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Next we make an 'instance' of it
const instance: AxiosInstance = axios.create({
  // .. where we make our configurations
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// Also add/ configure interceptors && all the other cool stuff
instance.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? token : '';
  return config;
});

instance.interceptors.response.use(function (response: AxiosResponse) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default instance;