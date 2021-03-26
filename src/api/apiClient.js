import axios from 'axios';
import apiURL from './helpers/apiURL';

const apiClient = axios.create({
  baseURL: apiURL()
});

export default apiClient;
