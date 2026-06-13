import { Router, Request, Response } from 'express';
import { CalculateOrderUseCase } from '../../domain/use-cases/CalculateOrderUseCase';
import { CheckoutUseCase } from '../../domain/use-cases/CheckoutUseCase';
import { CreateOrderUseCase } from '../../domain/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../domain/use-cases/UpdateOrderStatusUseCase';
import { authMiddleware } from '../middleware/authMiddleware';

export function createOrderRouter(
  calculateOrderUseCase: CalculateOrderUseCase,
  checkoutUseCase: CheckoutUseCase,
  createOrderUseCase: CreateOrderUseCase,
  updateOrderStatusUseCase: UpdateOrderStatusUseCase,
): Router {
  const router = Router();

  router.use(authMiddleware);

  router.post('/calculate', async (req: Request, res: Response) => {
    try {
      const result = await calculateOrderUseCase.execute(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/checkout', async (req: Request, res: Response) => {
    try {
      const staffId = parseInt((req as any).user.sub);
      const result = await checkoutUseCase.execute(req.body, staffId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const staffId = (req as any).user.sub.toString();
      const result = await createOrderUseCase.execute(req.body, staffId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.patch('/:id/status', async (req: Request, res: Response) => {
    try {
      const result = await updateOrderStatusUseCase.execute(req.params.id, req.body);
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
