import { Router } from 'express';
import { CreateTransactionUseCase } from '../../domain/use-cases/CreateTransactionUseCase';
import { GetTransactionByIdUseCase, NotFoundError } from '../../domain/use-cases/GetTransactionByIdUseCase';
import { MarkTransactionSyncedUseCase } from '../../domain/use-cases/MarkTransactionSyncedUseCase';
import { CreateTransactionSchema } from '../schemas/transactionSchemas';

export function internalTransactionRoutes(
  createTransactionUseCase: CreateTransactionUseCase,
  getTransactionByIdUseCase: GetTransactionByIdUseCase,
  markTransactionSyncedUseCase: MarkTransactionSyncedUseCase,
): Router {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const parsed = CreateTransactionSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.errors });
        return;
      }
      const id = await createTransactionUseCase.execute(parsed.data);
      res.status(201).json({ id });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const transaction = await getTransactionByIdUseCase.execute(req.params.id);
      res.json(transaction);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.patch('/:id/synced', async (req, res) => {
    try {
      const result = await markTransactionSyncedUseCase.execute(req.params.id);
      res.json(result);
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
