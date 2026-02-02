import axios from 'axios';
import { authUtils } from '../utils/auth.util';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const authHeader = authUtils.getAuthHeader();
  config.headers = { ...config.headers, ...authHeader };
  return config;
});

export const studentAPI = {
  // Get student profile
  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },

  // Update student profile
  updateProfile: async (profileData) => {
    const response = await api.put('/students/profile', profileData);
    return response.data;
  },

  // Get student applications
  getApplications: async () => {
    const response = await api.get('/students/applications');
    return response.data;
  },

  // Apply for opportunity
  applyForOpportunity: async (opportunityId, applicationData) => {
    const response = await api.post(`/students/applications/${opportunityId}`, applicationData);
    return response.data;
  },

  // Upload resume
  uploadResume: async (resumeFile) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    const response = await api.post('/students/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all students (Admin/Faculty only)
  getAllStudents: async (page = 1, limit = 10) => {
    const response = await api.get(`/students?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get student by ID (Admin/Faculty only)
  getStudentById: async (studentId) => {
    const response = await api.get(`/students/${studentId}`);
    return response.data;
  }
};