import express, { Application } from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';
import { productRoutes } from './routes/productRoutes';
import { internalProductRoutes } from './routes/internalProductRoutes';
import { GetProductByBarcodeUseCase } from '../domain/use-cases/GetProductByBarcodeUseCase';
import { GetProductByIdUseCase } from '../domain/use-cases/GetProductByIdUseCase';
import { GetProductsUseCase } from '../domain/use-cases/GetProductsUseCase';
import { SyncProductsUseCase } from '../domain/use-cases/SyncProductsUseCase';
import { CreateProductUseCase } from '../domain/use-cases/CreateProductUseCase';
import { UpdateProductUseCase } from '../domain/use-cases/UpdateProductUseCase';

export function createApp(
  getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
  getProductByIdUseCase: GetProductByIdUseCase,
  getProductsUseCase: GetProductsUseCase,
  syncProductsUseCase: SyncProductsUseCase,
  createProductUseCase: CreateProductUseCase,
  updateProductUseCase: UpdateProductUseCase,
): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(
    '/api/v1/products',
    authMiddleware,
    productRoutes(getProductByBarcodeUseCase, getProductsUseCase, syncProductsUseCase, createProductUseCase, updateProductUseCase),
  );

  app.use('/internal/v1/products', internalProductRoutes(getProductByIdUseCase));

  return app;
}
