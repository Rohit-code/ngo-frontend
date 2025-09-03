import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api',
  timeout: 60000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed in future
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      return response.data; // Return only the data part
    },
    (error) => {
      console.error('Response error:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        errorMessage = data?.message || `Server error (${status})`;
        
        if (status === 404) {
          errorMessage = 'Resource not found';
        } else if (status === 500) {
          errorMessage = 'Internal server error. Please try again later.';
        }
      } else if (error.request) {
        // Network error
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = 'Network error. Please check your internet connection.';
        }
      }
      
      // Only show error toast for non-404 errors to avoid spam
      if (!error.response || error.response.status !== 404) {
        toast.error(errorMessage);
      }
      
      return Promise.reject({
        ...error,
        message: errorMessage,
      });
    }
  );

export default api;