import 'dotenv/config';
import { createDatabase } from '@lightning-pos/database';
import { SqliteOrderRepositoryImpl } from './infrastructure/repositories/SqliteOrderRepositoryImpl';
import { SqliteTransactionRepositoryImpl } from './infrastructure/repositories/SqliteTransactionRepositoryImpl';
import { HttpOrderSyncGatewayImpl } from './infrastructure/gateways/HttpOrderSyncGatewayImpl';
import { HttpTransactionSyncGatewayImpl } from './infrastructure/gateways/HttpTransactionSyncGatewayImpl';
import { SyncOrderUseCase } from './domain/use-cases/SyncOrderUseCase';
import { SyncTransactionUseCase } from './domain/use-cases/SyncTransactionUseCase';
import { createSyncWorker } from './infrastructure/queue/SyncWorkerImpl';

const db = createDatabase();
const orderRepository = new SqliteOrderRepositoryImpl(db);
const transactionRepository = new SqliteTransactionRepositoryImpl(db);
const orderSyncGateway = new HttpOrderSyncGatewayImpl();
const transactionSyncGateway = new HttpTransactionSyncGatewayImpl();

const syncOrderUseCase = new SyncOrderUseCase(orderRepository, orderSyncGateway);
const syncTransactionUseCase = new SyncTransactionUseCase(transactionRepository, transactionSyncGateway);

const APP_MODE = process.env.APP_MODE === 'offline' ? 'offline' : 'online';

const worker =
  APP_MODE === 'online' ? createSyncWorker(syncOrderUseCase, syncTransactionUseCase) : null;

if (worker) {
  console.log('cashier-sync-service worker started, waiting for jobs...');
} else {
  console.log(
    '[cashier-sync-service] APP_MODE=offline, worker disabled — jobs stay queued in Redis until restarted in online mode',
  );
}

process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await worker?.close();
  process.exit(0);
});
