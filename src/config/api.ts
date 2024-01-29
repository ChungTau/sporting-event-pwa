import axios from 'axios';

const API_BASE_URL = 'http://chungtau.com:8080/api'||'127.0.0.1:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
});

export default axiosInstance;
