import 'dotenv/config';
import { createDatabase } from './infrastructure/database/DatabaseImpl';
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
);
const createProductUseCase = new CreateProductUseCase(productRepository, syncOutboxRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository, syncOutboxRepository);

const outboxWorker = new OutboxWorker(syncOutboxRepository, productSyncGateway);
outboxWorker.start();

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
