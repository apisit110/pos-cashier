import { Router } from 'express';
import { z } from 'zod';
import { GetProductByBarcodeUseCase, NotFoundError } from '../../application/usecases/GetProductByBarcodeUseCase';
import { GetProductsUseCase } from '../../application/usecases/GetProductsUseCase';
import { SyncProductsUseCase } from '../../application/usecases/SyncProductsUseCase';
import { CreateProductUseCase } from '../../application/usecases/CreateProductUseCase';
import { UpdateProductUseCase, NotFoundError as UpdateNotFoundError } from '../../application/usecases/UpdateProductUseCase';
import { GetProductsRequestDto } from '../dto/requests/GetProductsRequestDto';
import { GetProductByBarcodeRequestDto } from '../dto/requests/GetProductByBarcodeRequestDto';
import { CreateProductRequestDto } from '../dto/requests/CreateProductRequestDto';
import { UpdateProductRequestDto } from '../dto/requests/UpdateProductRequestDto';
import { ProductIdParamRequestDto } from '../dto/requests/ProductIdParamRequestDto';
import { SyncProductsRequestDto } from '../dto/requests/SyncProductsRequestDto';
import { GetProductsResponseDto } from '../dto/responses/GetProductsResponseDto';
import { ProductResponseDto } from '../dto/responses/ProductResponseDto';
import { SyncProductsResponseDto } from '../dto/responses/SyncProductsResponseDto';
import { SuccessResponseDto, ErrorResponseDto } from '@lightning-pos/http-response';
import { requireScope } from '../middleware/authMiddleware';

export function productRoutes(
  getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
  getProductsUseCase: GetProductsUseCase,
  syncProductsUseCase: SyncProductsUseCase,
  createProductUseCase: CreateProductUseCase,
  updateProductUseCase: UpdateProductUseCase,
): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const requestDto = GetProductsRequestDto.from(req.query);
      const products = await getProductsUseCase.execute({
        barcode: requestDto.barcode,
        name: requestDto.name,
        brand: requestDto.brand,
        price: requestDto.price,
      });
      res.json(SuccessResponseDto.of(GetProductsResponseDto.fromEntities(products)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.get('/barcode/:barcode', async (req, res) => {
    try {
      const requestDto = GetProductByBarcodeRequestDto.from(req.params);
      const product = await getProductByBarcodeUseCase.execute(requestDto.barcode);
      const { barcode: _barcode, ...body } = ProductResponseDto.fromEntity(product).toJSON();
      res.json(SuccessResponseDto.of(body));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      if (error instanceof NotFoundError) {
        res.status(404).json(ErrorResponseDto.of('404', error.message));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.post('/', requireScope('product:create'), async (req, res) => {
    try {
      const requestDto = CreateProductRequestDto.from(req.body);
      const product = await createProductUseCase.execute({
        barcode: requestDto.barcode,
        name: requestDto.name,
        price: requestDto.price,
        brand: requestDto.brand,
      });
      res.status(201).json(SuccessResponseDto.of(ProductResponseDto.fromEntity(product)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.put('/:id', requireScope('product:edit'), async (req, res) => {
    try {
      const paramsDto = ProductIdParamRequestDto.from(req.params);
      const requestDto = UpdateProductRequestDto.from(req.body);
      const product = await updateProductUseCase.execute(paramsDto.id, {
        name: requestDto.name,
        price: requestDto.price,
        brand: requestDto.brand,
      });
      res.json(SuccessResponseDto.of(ProductResponseDto.fromEntity(product)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      if (error instanceof UpdateNotFoundError) {
        res.status(404).json(ErrorResponseDto.of('404', error.message));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.post('/sync', requireScope('products:sync'), async (req, res) => {
    try {
      const requestDto = SyncProductsRequestDto.from(req.body);
      const result = await syncProductsUseCase.execute(requestDto.mid, requestDto.sid);
      res.json(SuccessResponseDto.of(SyncProductsResponseDto.fromResult(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  return router;
}
