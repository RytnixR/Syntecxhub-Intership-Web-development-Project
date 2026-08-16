import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || 'https://task-manager-backend-0un8.onrender.com/api';
const baseURL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/+$/, '')}/api`;

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((config) => {
  const user = localStorage.getItem('taskUser');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      const token = parsed?.token || parsed;
      if (token && typeof token === 'string') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
  return config;
});

export default API;