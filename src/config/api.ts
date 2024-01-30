import axios from 'axios';

const API_BASE_URL = 'http://dev.chungtau.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
