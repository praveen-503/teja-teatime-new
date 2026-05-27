import axios from 'axios';

function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim();

  if (!configured) return '/api';
  if (configured.startsWith('/')) return configured;

  try {
    const parsed = new URL(configured);
    if (!parsed.pathname || parsed.pathname === '/') {
      parsed.pathname = '/api';
    }
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return '/api';
  }
}

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  return config;
});

// Response interceptor — unwrap { success, data } envelope
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
