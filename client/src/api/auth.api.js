import api from './axios.js';
//Add comment so i can commit to github to rebuild my frontend in cloudpages
export const loginAPI = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerAPI = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getProfileAPI = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const refreshAPI = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

export const logoutAPI = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const logoutAllAPI = async () => {
  const response = await api.post('/auth/logout-all');
  return response.data;
};