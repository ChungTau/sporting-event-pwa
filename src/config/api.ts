// config/api.ts
import axios from 'axios';

const API_BASE_URL = '127.0.0.1:8080'; // Replace with your API base URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // You can add other headers like authentication tokens here
  },
});

export default axiosInstance;
