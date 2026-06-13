import { Router } from 'express';
import { GetProductByBarcodeUseCase, NotFoundError } from '../../domain/use-cases/GetProductByBarcodeUseCase';
import { GetProductsUseCase } from '../../domain/use-cases/GetProductsUseCase';
import { SyncProductsUseCase } from '../../domain/use-cases/SyncProductsUseCase';

export function productRoutes(
  getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
  getProductsUseCase: GetProductsUseCase,
  syncProductsUseCase: SyncProductsUseCase,
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
