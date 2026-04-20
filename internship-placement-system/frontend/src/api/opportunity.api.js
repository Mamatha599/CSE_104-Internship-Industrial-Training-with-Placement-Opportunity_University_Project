import axios from 'axios';
import { authUtils } from '../utils/auth.util';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authUtils.getAuthHeader() };
  return config;
});

export const opportunityAPI = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/opportunities?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/opportunities', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/opportunities/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/opportunities/${id}`);
    return response.data;
  }
};