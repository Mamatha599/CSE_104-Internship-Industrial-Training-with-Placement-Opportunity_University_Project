import axios from 'axios';
import { authUtils } from '../utils/auth.util';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authUtils.getAuthHeader() };
  return config;
});

export const analyticsAPI = {
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  
  getPlacementStats: async () => {
    const response = await api.get('/analytics/placement-stats');
    return response.data;
  },
  
  getApplicationStats: async () => {
    const response = await api.get('/analytics/application-stats');
    return response.data;
  }
};