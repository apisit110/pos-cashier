import { Module } from '@nestjs/common';
import { ProductController } from './presentation/controllers/ProductController';
import { GetProductByBarcodeUseCase } from './application/use-cases/GetProductByBarcodeUseCase';
import { SyncProductsUseCase } from './application/use-cases/SyncProductsUseCase';
import { GetProductsUseCase } from './application/use-cases/GetProductsUseCase';
import { SqliteProductRepository } from './infrastructure/repositories/SqliteProductRepository';
import { SqliteSyncMetadataRepository } from './infrastructure/repositories/SqliteSyncMetadataRepository';
import { HttpProductSyncGateway } from './infrastructure/repositories/HttpProductSyncGateway';
import { DatabaseProvider } from './infrastructure/database/database.provider';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    DatabaseProvider,
    {
      provide: 'ProductRepository',
      useClass: SqliteProductRepository,
    },
    {
      provide: 'SyncMetadataRepository',
      useClass: SqliteSyncMetadataRepository,
    },
    {
      provide: 'ProductSyncGateway',
      useClass: HttpProductSyncGateway,
    },
    {
      provide: GetProductByBarcodeUseCase,
      useFactory: (productRepository: SqliteProductRepository) => {
        return new GetProductByBarcodeUseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
    {
      provide: SyncProductsUseCase,
      useFactory: (
        productRepository: SqliteProductRepository,
        syncMetadataRepository: SqliteSyncMetadataRepository,
        productSyncGateway: HttpProductSyncGateway,
      ) => {
        return new SyncProductsUseCase(productRepository, syncMetadataRepository, productSyncGateway);
      },
      inject: ['ProductRepository', 'SyncMetadataRepository', 'ProductSyncGateway'],
    },
    {
      provide: GetProductsUseCase,
      useFactory: (productRepository: SqliteProductRepository) => {
        return new GetProductsUseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
  ],
})
export class AppModule {}
