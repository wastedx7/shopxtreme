import axios from 'axios';

// Base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Create axios instance with credentials for session cookies
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Handle authentication errors
    if (status === 401) {
      // User is not authenticated - could redirect to login
      // We'll handle this in the auth context
      console.warn('Authentication required');
    }
    
    if (status === 403) {
      console.warn('Access forbidden');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
