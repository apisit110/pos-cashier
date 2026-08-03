import express, { Application } from 'express';
import cors from 'cors';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { transactionRoutes } from './routes/transactionRoutes';
import { GetTransactionsUseCase } from '../domain/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from '../domain/use-cases/GetTransactionByIdUseCase';
import { GetTransactionSummaryUseCase } from '../domain/use-cases/GetTransactionSummaryUseCase';

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
    transactionRoutes(getTransactionsUseCase, getTransactionByIdUseCase, getTransactionSummaryUseCase),
  );

  return app;
}
