import { Router } from 'express';
import { z } from 'zod';
import { GetProductByBarcodeUseCase, NotFoundError } from '../../domain/use-cases/GetProductByBarcodeUseCase';
import { GetProductsUseCase } from '../../domain/use-cases/GetProductsUseCase';
import { SyncProductsUseCase } from '../../domain/use-cases/SyncProductsUseCase';
import { CreateProductUseCase } from '../../domain/use-cases/CreateProductUseCase';

const createProductSchema = z.object({
  barcode: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  brand: z.string().nullish(),
});

export function productRoutes(
  getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
  getProductsUseCase: GetProductsUseCase,
  syncProductsUseCase: SyncProductsUseCase,
  createProductUseCase: CreateProductUseCase,
): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const { barcode, name, brand, price } = req.query as Record<string, string | undefined>;
      const filters = {
        barcode,
        name,
        brand,
        price: price ? Number(price) : undefined,
      };
      const products = await getProductsUseCase.execute(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.get('/barcode/:barcode', async (req, res) => {
    try {
      const product = await getProductByBarcodeUseCase.execute(req.params.barcode);
      res.json(product);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/', async (req, res) => {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
      return;
    }

    try {
      const product = await createProductUseCase.execute(parsed.data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/sync', async (req, res) => {
    try {
      const { mid, sid } = req.body as { mid?: string; sid?: string };
      const result = await syncProductsUseCase.execute(mid, sid);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  return router;
}
