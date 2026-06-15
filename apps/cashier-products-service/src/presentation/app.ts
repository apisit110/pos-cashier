import express, { Application } from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';
import { productRoutes } from './routes/productRoutes';
import { GetProductByBarcodeUseCase } from '../domain/use-cases/GetProductByBarcodeUseCase';
import { GetProductsUseCase } from '../domain/use-cases/GetProductsUseCase';
import { SyncProductsUseCase } from '../domain/use-cases/SyncProductsUseCase';
import { CreateProductUseCase } from '../domain/use-cases/CreateProductUseCase';
import { UpdateProductUseCase } from '../domain/use-cases/UpdateProductUseCase';

export function createApp(
  getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
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

  return app;
}
