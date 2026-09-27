import express, { Application } from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';
import { productRoutes } from './routes/productRoutes';
import { internalProductRoutes } from './routes/internalProductRoutes';
import { GetProductByBarcodeUseCase } from '../application/usecases/GetProductByBarcodeUseCase';
import { GetProductByIdUseCase } from '../application/usecases/GetProductByIdUseCase';
import { GetProductsUseCase } from '../application/usecases/GetProductsUseCase';
import { SyncProductsUseCase } from '../application/usecases/SyncProductsUseCase';
import { CreateProductUseCase } from '../application/usecases/CreateProductUseCase';
import { UpdateProductUseCase } from '../application/usecases/UpdateProductUseCase';

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
