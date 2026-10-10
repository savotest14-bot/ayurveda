import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const ASSETS_BASE_URL = import.meta.env.VITE_BACKEND_URL || (API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization header if JWT token is stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('va_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear from storage
      const token = localStorage.getItem('va_auth_token');
      if (token && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('va_auth_token');
        localStorage.removeItem('va_user');
      }
    }
    return Promise.reject(error);
  }
);
