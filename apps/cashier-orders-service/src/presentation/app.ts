import express, { Application } from 'express';
import cors from 'cors';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../infrastructure/database/schema';
import { SqliteOrderRepositoryImpl } from '../infrastructure/repositories/SqliteOrderRepositoryImpl';
import { ApiPaymentServiceImpl } from '../infrastructure/services/ApiPaymentServiceImpl';
import { ApiTransactionServiceImpl } from '../infrastructure/services/ApiTransactionServiceImpl';
import { ApiStaffServiceImpl } from '../infrastructure/services/ApiStaffServiceImpl';
import { SyncQueueServiceImpl } from '../infrastructure/queue/SyncQueueServiceImpl';
import { CalculateOrderUseCase } from '../domain/use-cases/CalculateOrderUseCase';
import { CheckoutUseCase } from '../domain/use-cases/CheckoutUseCase';
import { CreateOrderUseCase } from '../domain/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../domain/use-cases/UpdateOrderStatusUseCase';
import { GetOrderByIdUseCase } from '../domain/use-cases/GetOrderByIdUseCase';
import { MarkOrderSyncedUseCase } from '../domain/use-cases/MarkOrderSyncedUseCase';
import { createOrderRouter } from './routes/orderRoutes';
import { createInternalOrderRouter } from './routes/internalOrderRoutes';

export function createApp(db: BetterSQLite3Database<typeof schema>): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const orderRepository = new SqliteOrderRepositoryImpl(db);
  const paymentService = new ApiPaymentServiceImpl();
  const transactionService = new ApiTransactionServiceImpl();
  const staffService = new ApiStaffServiceImpl();
  const syncQueueService = new SyncQueueServiceImpl();

  const calculateOrderUseCase = new CalculateOrderUseCase();
  const checkoutUseCase = new CheckoutUseCase(
    orderRepository,
    paymentService,
    transactionService,
    staffService,
    syncQueueService,
  );
  const createOrderUseCase = new CreateOrderUseCase(orderRepository);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
  const markOrderSyncedUseCase = new MarkOrderSyncedUseCase(orderRepository);

  app.use(
    '/api/v1/orders',
    createOrderRouter(calculateOrderUseCase, checkoutUseCase, createOrderUseCase, updateOrderStatusUseCase),
  );
  app.use(
    '/internal/v1/orders',
    createInternalOrderRouter(getOrderByIdUseCase, markOrderSyncedUseCase),
  );

  return app;
}
