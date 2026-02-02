import axios from 'axios';
import { authUtils } from '../utils/auth.util';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authUtils.getAuthHeader() };
  return config;
});

export const applicationAPI = {
  getAll: async () => {
    const response = await api.get('/applications');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  }
};