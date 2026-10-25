import 'dotenv/config';
import { createDatabase } from '@lightning-pos/database';
import { SqliteOrderRepositoryImpl } from './infrastructure/repositories/SqliteOrderRepositoryImpl';
import { SqliteTransactionRepositoryImpl } from './infrastructure/repositories/SqliteTransactionRepositoryImpl';
import { SqliteProductRepositoryImpl } from './infrastructure/repositories/SqliteProductRepositoryImpl';
import { SqliteSyncMetadataRepositoryImpl } from './infrastructure/repositories/SqliteSyncMetadataRepositoryImpl';
import { SqliteStaffRepositoryImpl } from './infrastructure/repositories/SqliteStaffRepositoryImpl';
import { HttpOrderSyncGatewayImpl } from './infrastructure/gateways/HttpOrderSyncGatewayImpl';
import { HttpTransactionSyncGatewayImpl } from './infrastructure/gateways/HttpTransactionSyncGatewayImpl';
import { HttpProductSyncGatewayImpl } from './infrastructure/gateways/HttpProductSyncGatewayImpl';
import { HttpCashierProfileGatewayImpl } from './infrastructure/gateways/HttpCashierProfileGatewayImpl';
import { HttpSyncStateGatewayImpl } from './infrastructure/gateways/HttpSyncStateGatewayImpl';
import { SyncOrderUseCase } from './application/usecases/SyncOrderUseCase';
import { SyncTransactionUseCase } from './application/usecases/SyncTransactionUseCase';
import { SyncProductsUseCase } from './application/usecases/SyncProductsUseCase';
import { SyncCashierProfileUseCase } from './application/usecases/SyncCashierProfileUseCase';
import { SyncPullUseCase } from './application/usecases/SyncPullUseCase';
import { ScheduleSyncPullUseCase } from './application/usecases/ScheduleSyncPullUseCase';
import { createSyncWorker } from './infrastructure/queue/SyncWorkerImpl';
import { SyncQueueServiceImpl } from './infrastructure/queue/SyncQueueServiceImpl';

const db = createDatabase();
const orderRepository = new SqliteOrderRepositoryImpl(db);
const transactionRepository = new SqliteTransactionRepositoryImpl(db);
const productRepository = new SqliteProductRepositoryImpl(db);
const syncMetadataRepository = new SqliteSyncMetadataRepositoryImpl(db);
const staffRepository = new SqliteStaffRepositoryImpl(db);
const orderSyncGateway = new HttpOrderSyncGatewayImpl();
const transactionSyncGateway = new HttpTransactionSyncGatewayImpl();
const productSyncGateway = new HttpProductSyncGatewayImpl();
const cashierProfileGateway = new HttpCashierProfileGatewayImpl();
const syncStateGateway = new HttpSyncStateGatewayImpl();

const syncOrderUseCase = new SyncOrderUseCase(orderRepository, orderSyncGateway);
const syncTransactionUseCase = new SyncTransactionUseCase(transactionRepository, transactionSyncGateway);
const syncProductsUseCase = new SyncProductsUseCase(productRepository, syncMetadataRepository, productSyncGateway);
const syncCashierProfileUseCase = new SyncCashierProfileUseCase(staffRepository, syncMetadataRepository, cashierProfileGateway);
const syncPullUseCase = new SyncPullUseCase(
  syncMetadataRepository,
  syncStateGateway,
  syncProductsUseCase,
  syncCashierProfileUseCase,
);

const APP_MODE = process.env.APP_MODE === 'offline' ? 'offline' : 'online';

const syncQueueService = APP_MODE === 'online' ? new SyncQueueServiceImpl() : null;

const worker = syncQueueService
  ? createSyncWorker(
      syncOrderUseCase,
      syncTransactionUseCase,
      syncProductsUseCase,
      syncCashierProfileUseCase,
      syncPullUseCase,
      new ScheduleSyncPullUseCase(syncMetadataRepository, syncQueueService),
    )
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
  await syncQueueService?.close();
  process.exit(0);
});
