import { Router } from 'express';
import { GetProductByIdUseCase, NotFoundError } from '../../domain/use-cases/GetProductByIdUseCase';

export function internalProductRoutes(getProductByIdUseCase: GetProductByIdUseCase): Router {
  const router = Router();

  router.get('/:id', async (req, res) => {
    try {
      const product = await getProductByIdUseCase.execute(req.params.id);
      res.json(product);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: (error as Error).message });
    }
  });

  return router;
}
