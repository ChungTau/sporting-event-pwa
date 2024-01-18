import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL||'127.0.0.1:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
