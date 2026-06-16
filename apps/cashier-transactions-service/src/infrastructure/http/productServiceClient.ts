import axios from 'axios';

export const productServiceClient = axios.create({
  baseURL: process.env.PRODUCT_SERVICE_URL ?? 'http://localhost:3001/internal/v1',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});
