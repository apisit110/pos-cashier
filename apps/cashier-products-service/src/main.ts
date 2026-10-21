import 'dotenv/config';

if (!process.env.JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

import { createDatabase } from '@lightning-pos/database';
import { SqliteProductRepositoryImpl } from './infrastructure/repositories/SqliteProductRepositoryImpl';
import { SqliteSyncMetadataRepositoryImpl } from './infrastructure/repositories/SqliteSyncMetadataRepositoryImpl';
import { SqliteSyncOutboxRepositoryImpl } from './infrastructure/repositories/SqliteSyncOutboxRepositoryImpl';
import { HttpProductCenterRepositoryImpl } from './infrastructure/repositories/HttpProductCenterRepositoryImpl';
import { OutboxWorker } from './infrastructure/workers/OutboxWorker';
import { GetProductByBarcodeUseCase } from './application/usecases/GetProductByBarcodeUseCase';
import { GetProductByIdUseCase } from './application/usecases/GetProductByIdUseCase';
import { GetProductsUseCase } from './application/usecases/GetProductsUseCase';
import { SyncProductsUseCase } from './application/usecases/SyncProductsUseCase';
import { CreateProductUseCase } from './application/usecases/CreateProductUseCase';
import { UpdateProductUseCase } from './application/usecases/UpdateProductUseCase';
import { createApp } from './presentation/app';

const PORT = process.env.PORT ?? 3001;
const APP_MODE = process.env.APP_MODE === 'offline' ? 'offline' : 'online';

const db = createDatabase();
const productRepository = new SqliteProductRepositoryImpl(db);
const syncMetadataRepository = new SqliteSyncMetadataRepositoryImpl(db);
const syncOutboxRepository = new SqliteSyncOutboxRepositoryImpl(db);
const productCenterRepository = new HttpProductCenterRepositoryImpl();

const getProductByBarcodeUseCase = new GetProductByBarcodeUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const getProductsUseCase = new GetProductsUseCase(productRepository);
const syncProductsUseCase = new SyncProductsUseCase(
  productRepository,
  syncMetadataRepository,
  productCenterRepository,
  APP_MODE,
);
const createProductUseCase = new CreateProductUseCase(productRepository, syncOutboxRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository, syncOutboxRepository);

const outboxWorker = new OutboxWorker(syncOutboxRepository, productCenterRepository);
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
