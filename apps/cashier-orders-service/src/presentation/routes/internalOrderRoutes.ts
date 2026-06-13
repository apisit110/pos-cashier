import { Router, Request, Response } from 'express';
import { GetOrderByIdUseCase } from '../../domain/use-cases/GetOrderByIdUseCase';
import { MarkOrderSyncedUseCase } from '../../domain/use-cases/MarkOrderSyncedUseCase';

export function createInternalOrderRouter(
  getOrderByIdUseCase: GetOrderByIdUseCase,
  markOrderSyncedUseCase: MarkOrderSyncedUseCase,
): Router {
  const router = Router();

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const result = await getOrderByIdUseCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if ((error as Error).name === 'NotFoundError') {
        res.status(404).json({ message: (error as Error).message });
      } else {
        res.status(500).json({ message: (error as Error).message });
      }
    }
  });

  router.patch('/:id/synced', async (req: Request, res: Response) => {
    try {
      const result = await markOrderSyncedUseCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if ((error as Error).name === 'NotFoundError') {
        res.status(404).json({ message: (error as Error).message });
      } else {
        res.status(500).json({ message: (error as Error).message });
      }
    }
  });

  return router;
}
