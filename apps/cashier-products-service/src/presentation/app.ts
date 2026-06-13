import express, { Application } from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';
import { productRoutes } from './routes/productRoutes';
import { GetProductByBarcodeUseCase } from '../domain/use-cases/GetProductByBarcodeUseCase';
import { GetProductsUseCase } from '../domain/use-cases/GetProductsUseCase';
import { SyncProductsUseCase } from '../domain/use-cases/SyncProductsUseCase';

export function createApp(
  getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
  getProductsUseCase: GetProductsUseCase,
  syncProductsUseCase: SyncProductsUseCase,
): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(
    '/api/v1/products',
    authMiddleware,
    productRoutes(getProductByBarcodeUseCase, getProductsUseCase, syncProductsUseCase),
  );

  return app;
}
