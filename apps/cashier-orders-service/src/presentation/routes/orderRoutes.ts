import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { CalculateOrderUseCase } from '../../application/usecases/CalculateOrderUseCase';
import { CheckoutUseCase } from '../../application/usecases/CheckoutUseCase';
import { CreateOrderUseCase } from '../../application/usecases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../application/usecases/UpdateOrderStatusUseCase';
import { CalculateOrderRequestDto } from '../dto/requests/CalculateOrderRequestDto';
import { CheckoutRequestDto } from '../dto/requests/CheckoutRequestDto';
import { CreateOrderRequestDto } from '../dto/requests/CreateOrderRequestDto';
import { UpdateOrderStatusRequestDto } from '../dto/requests/UpdateOrderStatusRequestDto';
import { CalculateOrderResponseDto } from '../dto/responses/CalculateOrderResponseDto';
import { CheckoutResponseDto } from '../dto/responses/CheckoutResponseDto';
import { OrderResponseDto } from '../dto/responses/OrderResponseDto';
import { SuccessResponseDto, ErrorResponseDto } from '@lightning-pos/http-response';
import { authMiddleware, requireScope, requireTerminal } from '../middleware/authMiddleware';

export function createOrderRouter(
  calculateOrderUseCase: CalculateOrderUseCase,
  checkoutUseCase: CheckoutUseCase,
  createOrderUseCase: CreateOrderUseCase,
  updateOrderStatusUseCase: UpdateOrderStatusUseCase,
): Router {
  const router = Router();

  router.use(authMiddleware);
  router.use(requireScope('sell:create'));
  router.use(requireTerminal);

  router.post('/calculate', async (req: Request, res: Response) => {
    try {
      const requestDto = CalculateOrderRequestDto.from(req.body);
      const result = await calculateOrderUseCase.execute({
        items: requestDto.items,
        memberId: requestDto.memberId,
      });
      res.json(SuccessResponseDto.of(CalculateOrderResponseDto.fromResult(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.post('/checkout', async (req: Request, res: Response) => {
    try {
      const requestDto = CheckoutRequestDto.from(req.body);
      const { sub, tid, mid, sid } = (req as any).user;
      const staffId = parseInt(sub);
      const result = await checkoutUseCase.execute(
        {
          items: requestDto.items,
          memberId: requestDto.memberId,
          paymentMethod: requestDto.paymentMethod,
          receivedAmount: requestDto.receivedAmount,
          idempotencyKey: requestDto.idempotencyKey,
        },
        staffId,
        { tid, mid, sid },
      );
      res.json(SuccessResponseDto.of(CheckoutResponseDto.fromEntity(result as any)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const requestDto = CreateOrderRequestDto.from(req.body);
      const { sub, tid, mid, sid } = (req as any).user;
      const result = await createOrderUseCase.execute({ items: requestDto.items }, sub.toString(), { tid, mid, sid });
      res.status(201).json(SuccessResponseDto.of(OrderResponseDto.fromEntity(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.patch('/:id/status', async (req: Request, res: Response) => {
    try {
      const requestDto = UpdateOrderStatusRequestDto.from(req.body);
      const result = await updateOrderStatusUseCase.execute(req.params.id as string, { status: requestDto.status });
      res.json(SuccessResponseDto.of(OrderResponseDto.fromEntity(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      if ((error as Error).name === 'NotFoundError') {
        res.status(404).json(ErrorResponseDto.of('404', (error as Error).message));
      } else {
        res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
      }
    }
  });

  return router;
}
