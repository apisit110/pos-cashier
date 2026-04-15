import axios from 'axios';

const api = axios.create();

// Key used for storage
const STORAGE_KEY = 'lightning_pos_session';

api.interceptors.request.use(
  (config) => {
    const sessionStr = localStorage.getItem(STORAGE_KEY);
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (error) {
        console.error('Error parsing session for interceptor:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic for session expiration could go here (e.g., redirect to login)
      console.warn('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export default api;
