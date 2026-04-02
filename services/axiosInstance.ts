// In a separate file, e.g., services/axiosinstance.js
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_BASE_URL, // Your API's base URL
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers here
  },
  timeout: 5000, // Optional: Timeout in milliseconds
});

export default axiosInstance;















