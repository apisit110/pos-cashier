import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { CalculateOrderUseCase } from '../../domain/use-cases/CalculateOrderUseCase';
import { CheckoutUseCase } from '../../domain/use-cases/CheckoutUseCase';
import { CreateOrderUseCase } from '../../domain/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../domain/use-cases/UpdateOrderStatusUseCase';
import { OrderStatus } from '../../domain/entities/Order';
import { authMiddleware, requireScope } from '../middleware/authMiddleware';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const calculateOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  memberId: z.string().min(1).optional(),
});

const checkoutSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  memberId: z.string().min(1).optional(),
  paymentMethod: z.string().min(1),
  receivedAmount: z.number().nonnegative().optional(),
  idempotencyKey: z.string().min(1).optional(),
});

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
      }),
    )
    .min(1),
});

const updateOrderStatusSchema = z.object({
  status: z.enum([OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.CANCELLED]),
});

export function createOrderRouter(
  calculateOrderUseCase: CalculateOrderUseCase,
  checkoutUseCase: CheckoutUseCase,
  createOrderUseCase: CreateOrderUseCase,
  updateOrderStatusUseCase: UpdateOrderStatusUseCase,
): Router {
  const router = Router();

  router.use(authMiddleware);
  router.use(requireScope('sell:create'));

  router.post('/calculate', async (req: Request, res: Response) => {
    const parsed = calculateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
      return;
    }

    try {
      const result = await calculateOrderUseCase.execute(parsed.data);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/checkout', async (req: Request, res: Response) => {
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
      return;
    }

    try {
      const staffId = parseInt((req as any).user.sub);
      const result = await checkoutUseCase.execute(parsed.data, staffId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
      return;
    }

    try {
      const staffId = (req as any).user.sub.toString();
      const result = await createOrderUseCase.execute(parsed.data, staffId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.patch('/:id/status', async (req: Request, res: Response) => {
    const parsed = updateOrderStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
      return;
    }

    try {
      const result = await updateOrderStatusUseCase.execute(req.params.id, parsed.data);
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
