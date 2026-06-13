import express, { Application } from 'express';
import cors from 'cors';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { transactionRoutes } from './routes/transactionRoutes';
import { internalTransactionRoutes } from './routes/internalTransactionRoutes';
import { GetTransactionsUseCase } from '../domain/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from '../domain/use-cases/GetTransactionByIdUseCase';
import { CreateTransactionUseCase } from '../domain/use-cases/CreateTransactionUseCase';
import { MarkTransactionSyncedUseCase } from '../domain/use-cases/MarkTransactionSyncedUseCase';

export function createApp(
  getTransactionsUseCase: GetTransactionsUseCase,
  getTransactionByIdUseCase: GetTransactionByIdUseCase,
  createTransactionUseCase: CreateTransactionUseCase,
  markTransactionSyncedUseCase: MarkTransactionSyncedUseCase,
): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(loggingMiddleware);

  app.use('/api/v1/transactions', transactionRoutes(getTransactionsUseCase, getTransactionByIdUseCase));
  app.use(
    '/internal/v1/transactions',
    internalTransactionRoutes(createTransactionUseCase, getTransactionByIdUseCase, markTransactionSyncedUseCase),
  );

  return app;
}
