import apiClient from './apiClient';

export default {
  show: (shortId) => apiClient.get(`/api/room/${shortId}`),
  validatePassword: ({ shortId, password }) => apiClient.get(`/api/room/${shortId}/validate-password?password=${password}`),
  create: (params) => apiClient.post('/api/room', { ...params })
};
