import express, { Application } from 'express';
import cors from 'cors';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { authMiddleware } from './middleware/authMiddleware';
import { transactionRoutes } from './routes/transactionRoutes';
import { GetTransactionsUseCase } from '../application/usecases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from '../application/usecases/GetTransactionByIdUseCase';
import { GetTransactionSummaryUseCase } from '../application/usecases/GetTransactionSummaryUseCase';

export function createApp(
  getTransactionsUseCase: GetTransactionsUseCase,
  getTransactionByIdUseCase: GetTransactionByIdUseCase,
  getTransactionSummaryUseCase: GetTransactionSummaryUseCase,
): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(loggingMiddleware);

  app.use(
    '/api/v1/transactions',
    authMiddleware,
    transactionRoutes(getTransactionsUseCase, getTransactionByIdUseCase, getTransactionSummaryUseCase),
  );

  return app;
}
