import { Module } from '@nestjs/common';
import { ProductController } from './presentation/controllers/ProductController';
import { GetProductByBarcodeUseCase } from './application/use-cases/GetProductByBarcodeUseCase';
import { SqliteProductRepository } from './infrastructure/repositories/SqliteProductRepository';
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
      provide: GetProductByBarcodeUseCase,
      useFactory: (productRepository: SqliteProductRepository) => {
        return new GetProductByBarcodeUseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
  ],
})
export class AppModule {}
