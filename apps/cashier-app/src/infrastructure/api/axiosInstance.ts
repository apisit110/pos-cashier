import axios from 'axios';

const STORAGE_KEY = 'lightning_pos_session';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const sessionStr = localStorage.getItem(STORAGE_KEY);
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch {
      // ignore malformed session
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export default api;
