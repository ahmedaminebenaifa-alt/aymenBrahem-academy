import api from './axios.js';

export const getLiveToken = async (roomName) => {
  const response = await api.post('/live/token', {});
  return response.data;
};