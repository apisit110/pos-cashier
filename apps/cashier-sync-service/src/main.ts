import 'dotenv/config';
import { ApiOrderRepositoryImpl } from './infrastructure/repositories/ApiOrderRepositoryImpl';
import { ApiTransactionRepositoryImpl } from './infrastructure/repositories/ApiTransactionRepositoryImpl';
import { HttpOrderSyncGatewayImpl } from './infrastructure/gateways/HttpOrderSyncGatewayImpl';
import { HttpTransactionSyncGatewayImpl } from './infrastructure/gateways/HttpTransactionSyncGatewayImpl';
import { SyncOrderUseCase } from './domain/use-cases/SyncOrderUseCase';
import { SyncTransactionUseCase } from './domain/use-cases/SyncTransactionUseCase';
import { createSyncWorker } from './infrastructure/queue/SyncWorkerImpl';

const orderRepository = new ApiOrderRepositoryImpl();
const transactionRepository = new ApiTransactionRepositoryImpl();
const orderSyncGateway = new HttpOrderSyncGatewayImpl();
const transactionSyncGateway = new HttpTransactionSyncGatewayImpl();

const syncOrderUseCase = new SyncOrderUseCase(orderRepository, orderSyncGateway);
const syncTransactionUseCase = new SyncTransactionUseCase(transactionRepository, transactionSyncGateway);

const worker = createSyncWorker(syncOrderUseCase, syncTransactionUseCase);

console.log('cashier-sync-service worker started, waiting for jobs...');

process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await worker.close();
  process.exit(0);
});
