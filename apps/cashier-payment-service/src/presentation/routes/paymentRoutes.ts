import { Router } from 'express';
import { ProcessPaymentUseCase, ProcessPaymentDto } from '../../domain/use-cases/ProcessPaymentUseCase';
import { authMiddleware } from '../middleware/authMiddleware';
import { internalMiddleware } from '../middleware/internalMiddleware';

export function paymentRoutes(processPaymentUseCase: ProcessPaymentUseCase): Router {
  const router = Router();

  router.post('/', authMiddleware, async (req, res) => {
    try {
      const dto = req.body as ProcessPaymentDto;
      const payment = await processPaymentUseCase.execute(dto);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/internal', internalMiddleware, async (req, res) => {
    try {
      const dto = req.body as ProcessPaymentDto;
      const payment = await processPaymentUseCase.execute(dto);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  return router;
}
