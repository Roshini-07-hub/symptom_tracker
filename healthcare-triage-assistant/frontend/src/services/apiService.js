import axios from 'axios';

/**
 * API Service
 * Handles all backend API communication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let the browser set Content-Type automatically for FormData (includes correct boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Chat API calls
export const chatAPI = {
  intakeSymptoms: (data) => api.post('/chat/symptoms', data),
  getHistory: (limit = 10, skip = 0) => api.get(`/chat/history?limit=${limit}&skip=${skip}`),
  getReport: (reportId) => api.get(`/chat/report/${reportId}`)
};

// RAG API calls
export const ragAPI = {
  uploadDocument: (data) => api.post('/rag/upload', data),
  searchDocuments: (data) => api.post('/rag/search', data),
  getAllDocuments: (limit = 10, skip = 0, category = '', language = 'en') => 
    api.get(`/rag/documents?limit=${limit}&skip=${skip}&category=${category}&language=${language}`),
  getDocument: (documentId) => api.get(`/rag/documents/${documentId}`),
  deleteDocument: (documentId) => api.delete(`/rag/documents/${documentId}`)
};

// Classification API calls
export const classifyAPI = {
  classifySymptoms: (data) => api.post('/classify/symptoms', data),
  detectEmergency: (data) => api.post('/classify/emergency', data)
};

// Recommendation API calls
export const recommendationAPI = {
  generateRecommendation: (data) => api.post('/recommendation/generate', data)
};

// Report API calls
export const reportAPI = {
  // Do NOT set Content-Type manually — axios will set multipart/form-data with the correct boundary automatically
  uploadReport: (formData) => api.post('/reports/upload', formData),
  getUserReports: (limit = 10, skip = 0, language = 'en') => 
    api.get(`/reports/my-reports?limit=${limit}&skip=${skip}&language=${language}`),
  deleteReport: (reportId, language = 'en') => 
    api.delete(`/reports/${reportId}?language=${language}`)
};

// Audit API calls
export const auditAPI = {
  getUserLogs: (limit = 20, skip = 0, action = '') => 
    api.get(`/audit/logs?limit=${limit}&skip=${skip}&action=${action}`),
  getStatistics: (days = 30) => api.get(`/audit/statistics?days=${days}`)
};

// Admin API calls
export const adminAPI = {
  getAllUsers: (limit = 20, skip = 0) => api.get(`/admin/users?limit=${limit}&skip=${skip}`),
  getDashboardStats: (days = 30) => api.get(`/admin/dashboard?days=${days}`),
  getAllAuditLogs: (limit = 50, skip = 0, action = '', riskLevel = '') =>
    api.get(`/admin/audit-logs?limit=${limit}&skip=${skip}&action=${action}&riskLevel=${riskLevel}`),
  promoteToAdmin: (userId) => api.patch(`/admin/users/${userId}/promote`)
};

// Create apiService object for convenient access
export const apiService = {
  auth: authAPI,
  chat: chatAPI,
  rag: ragAPI,
  classify: classifyAPI,
  recommendation: recommendationAPI,
  reports: reportAPI,
  audit: auditAPI,
  admin: adminAPI
};

export default api;
