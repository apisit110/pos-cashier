import express, { Application } from 'express';
import cors from 'cors';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { schema } from '@lightning-pos/model';
import { SqliteOrderRepositoryImpl } from '../infrastructure/repositories/SqliteOrderRepositoryImpl';
import { SqliteStaffServiceImpl } from '../infrastructure/services/SqliteStaffServiceImpl';
import { SyncQueueServiceImpl } from '../infrastructure/queue/SyncQueueServiceImpl';
import { CalculateOrderUseCase } from '../domain/use-cases/CalculateOrderUseCase';
import { CheckoutUseCase } from '../domain/use-cases/CheckoutUseCase';
import { CreateOrderUseCase } from '../domain/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../domain/use-cases/UpdateOrderStatusUseCase';
import { createOrderRouter } from './routes/orderRoutes';

export function createApp(db: BetterSQLite3Database<typeof schema>): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const orderRepository = new SqliteOrderRepositoryImpl(db);
  const staffService = new SqliteStaffServiceImpl(db);
  const syncQueueService = new SyncQueueServiceImpl();

  const calculateOrderUseCase = new CalculateOrderUseCase(db);
  const checkoutUseCase = new CheckoutUseCase(orderRepository, staffService, syncQueueService, db);
  const createOrderUseCase = new CreateOrderUseCase(orderRepository);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);

  app.use(
    '/api/v1/orders',
    createOrderRouter(calculateOrderUseCase, checkoutUseCase, createOrderUseCase, updateOrderStatusUseCase),
  );

  return app;
}
