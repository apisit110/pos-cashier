import express, { Application } from 'express';
import cors from 'cors';
import { paymentRoutes } from './routes/paymentRoutes';
import { ProcessPaymentUseCase } from '../domain/use-cases/ProcessPaymentUseCase';

export function createApp(processPaymentUseCase: ProcessPaymentUseCase): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/v1/payment', paymentRoutes(processPaymentUseCase));

  return app;
}
