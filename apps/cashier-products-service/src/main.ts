import 'dotenv/config';

if (!process.env.JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

import { createDatabase } from '@lightning-pos/database';
import { SqliteProductRepositoryImpl } from './infrastructure/repositories/SqliteProductRepositoryImpl';
import { SqliteSyncMetadataRepositoryImpl } from './infrastructure/repositories/SqliteSyncMetadataRepositoryImpl';
import { SqliteSyncOutboxRepositoryImpl } from './infrastructure/repositories/SqliteSyncOutboxRepositoryImpl';
import { HttpProductSyncGatewayImpl } from './infrastructure/gateways/HttpProductSyncGatewayImpl';
import { OutboxWorker } from './infrastructure/workers/OutboxWorker';
import { GetProductByBarcodeUseCase } from './domain/use-cases/GetProductByBarcodeUseCase';
import { GetProductByIdUseCase } from './domain/use-cases/GetProductByIdUseCase';
import { GetProductsUseCase } from './domain/use-cases/GetProductsUseCase';
import { SyncProductsUseCase } from './domain/use-cases/SyncProductsUseCase';
import { CreateProductUseCase } from './domain/use-cases/CreateProductUseCase';
import { UpdateProductUseCase } from './domain/use-cases/UpdateProductUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3001;
const APP_MODE = process.env.APP_MODE === 'offline' ? 'offline' : 'online';

const db = createDatabase();
const productRepository = new SqliteProductRepositoryImpl(db);
const syncMetadataRepository = new SqliteSyncMetadataRepositoryImpl(db);
const syncOutboxRepository = new SqliteSyncOutboxRepositoryImpl(db);
const productSyncGateway = new HttpProductSyncGatewayImpl();

const getProductByBarcodeUseCase = new GetProductByBarcodeUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const getProductsUseCase = new GetProductsUseCase(productRepository);
const syncProductsUseCase = new SyncProductsUseCase(
  productRepository,
  syncMetadataRepository,
  productSyncGateway,
  APP_MODE,
);
const createProductUseCase = new CreateProductUseCase(productRepository, syncOutboxRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository, syncOutboxRepository);

const outboxWorker = new OutboxWorker(syncOutboxRepository, productSyncGateway);
if (APP_MODE === 'online') {
  outboxWorker.start();
} else {
  console.log('[OutboxWorker] APP_MODE=offline, sync to pos-center is disabled');
}

const app = createApp(
  getProductByBarcodeUseCase,
  getProductByIdUseCase,
  getProductsUseCase,
  syncProductsUseCase,
  createProductUseCase,
  updateProductUseCase,
);

app.listen(PORT, () => {
  console.log(`Products Service is running on http://localhost:${PORT}`);
});
