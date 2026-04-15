import { Module } from '@nestjs/common';
import { ProductController } from './presentation/controllers/ProductController';
import { GetProductByBarcodeUseCase } from './application/use-cases/GetProductByBarcodeUseCase';
import { MockProductRepository } from './infrastructure/repositories/MockProductRepository';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: MockProductRepository,
    },
    {
      provide: GetProductByBarcodeUseCase,
      useFactory: (productRepository: MockProductRepository) => {
        return new GetProductByBarcodeUseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
  ],
})
export class AppModule {}
