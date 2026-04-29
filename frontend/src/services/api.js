import axios from 'axios';

// Ensure this matches your deployment backend URL in production
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_URL = import.meta.env.VITE_API_URL || `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
