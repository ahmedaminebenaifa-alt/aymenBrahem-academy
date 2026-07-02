import axios from 'axios';

const api = axios.create({
  // Fallback to localhost if the environment variable isn't loaded yet
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Automatically inject token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Catch global API issues (like expired tokens)
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error) => {
    // If the backend returns 401 Unauthorized, the token is dead
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Clean up user state if saved
      
      // Optional: Force route to login if not already there
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Pass the error message along so the individual component/hook can catch it
    return Promise.reject(error);
  }
);

export default api;