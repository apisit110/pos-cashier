import { Router } from 'express';
import { GetTransactionsUseCase } from '../../domain/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase, NotFoundError } from '../../domain/use-cases/GetTransactionByIdUseCase';
import { GetTransactionSummaryUseCase } from '../../domain/use-cases/GetTransactionSummaryUseCase';
import { GetTransactionsFilterSchema, GetTransactionSummaryQuerySchema } from '../schemas/transactionSchemas';
import { requireScope } from '../middleware/authMiddleware';

export function transactionRoutes(
  getTransactionsUseCase: GetTransactionsUseCase,
  getTransactionByIdUseCase: GetTransactionByIdUseCase,
  getTransactionSummaryUseCase: GetTransactionSummaryUseCase,
): Router {
  const router = Router();

  router.use(requireScope('transaction:view'));

  router.get('/', async (req, res) => {
    try {
      const parsed = GetTransactionsFilterSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ message: 'Invalid query parameters', errors: parsed.error.issues });
        return;
      }
      const { page, limit, ...filter } = parsed.data;
      const result = await getTransactionsUseCase.execute(page!, limit!, filter);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Registered before /:id so "summary" isn't swallowed as a transaction id param.
  router.get('/summary', async (req, res) => {
    try {
      const parsed = GetTransactionSummaryQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ message: 'Invalid query parameters', errors: parsed.error.issues });
        return;
      }
      const { period, startDate, endDate, storeId } = parsed.data;
      const result = await getTransactionSummaryUseCase.execute({
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        storeId,
      });
      res.json({ buckets: result });
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

  return router;
}
