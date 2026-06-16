import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://127.0.0.1:4002/v1/sync',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
