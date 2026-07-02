import api from './axios.js';

/**
 * Send user credentials to the backend to get a JWT
 */
export const loginAPI = async (credentials) => {
  // credentials should be an object like: { email: '...', password: '...' }
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Register a new user
 */
export const registerAPI = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Optional: Fetch the currently logged-in user's profile using their token
 */
export const getProfileAPI = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};