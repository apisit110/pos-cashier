import 'dotenv/config';
import { createDatabase } from '@lightning-pos/database';
import { SqliteOrderRepositoryImpl } from './infrastructure/repositories/SqliteOrderRepositoryImpl';
import { SqliteTransactionRepositoryImpl } from './infrastructure/repositories/SqliteTransactionRepositoryImpl';
import { SqliteProductRepositoryImpl } from './infrastructure/repositories/SqliteProductRepositoryImpl';
import { SqliteSyncMetadataRepositoryImpl } from './infrastructure/repositories/SqliteSyncMetadataRepositoryImpl';
import { HttpOrderSyncGatewayImpl } from './infrastructure/gateways/HttpOrderSyncGatewayImpl';
import { HttpTransactionSyncGatewayImpl } from './infrastructure/gateways/HttpTransactionSyncGatewayImpl';
import { HttpProductSyncGatewayImpl } from './infrastructure/gateways/HttpProductSyncGatewayImpl';
import { SyncOrderUseCase } from './application/usecases/SyncOrderUseCase';
import { SyncTransactionUseCase } from './application/usecases/SyncTransactionUseCase';
import { SyncProductsUseCase } from './application/usecases/SyncProductsUseCase';
import { createSyncWorker } from './infrastructure/queue/SyncWorkerImpl';

const db = createDatabase();
const orderRepository = new SqliteOrderRepositoryImpl(db);
const transactionRepository = new SqliteTransactionRepositoryImpl(db);
const productRepository = new SqliteProductRepositoryImpl(db);
const syncMetadataRepository = new SqliteSyncMetadataRepositoryImpl(db);
const orderSyncGateway = new HttpOrderSyncGatewayImpl();
const transactionSyncGateway = new HttpTransactionSyncGatewayImpl();
const productSyncGateway = new HttpProductSyncGatewayImpl();

const syncOrderUseCase = new SyncOrderUseCase(orderRepository, orderSyncGateway);
const syncTransactionUseCase = new SyncTransactionUseCase(transactionRepository, transactionSyncGateway);
const syncProductsUseCase = new SyncProductsUseCase(productRepository, syncMetadataRepository, productSyncGateway);

const APP_MODE = process.env.APP_MODE === 'offline' ? 'offline' : 'online';

const worker =
  APP_MODE === 'online'
    ? createSyncWorker(syncOrderUseCase, syncTransactionUseCase, syncProductsUseCase)
    : null;

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
