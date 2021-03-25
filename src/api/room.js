import apiClient from './apiClient';

export default {
  create: () => apiClient.post('/api/room'),
  show: (shortId) => apiClient.get(`/api/room/${shortId}`)
};
