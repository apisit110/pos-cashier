import axios from 'axios';

export const orderServiceClient = axios.create({
  baseURL: process.env.ORDER_SERVICE_URL ?? 'http://localhost:3002/internal/v1',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});
