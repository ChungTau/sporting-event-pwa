import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080/api'||'http://dev.chungtau.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
