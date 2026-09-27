import { Router } from 'express';
import { z } from 'zod';
import { GetTransactionsUseCase } from '../../application/usecases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase, NotFoundError } from '../../application/usecases/GetTransactionByIdUseCase';
import { GetTransactionSummaryUseCase } from '../../application/usecases/GetTransactionSummaryUseCase';
import { GetTransactionsRequestDto } from '../dto/requests/GetTransactionsRequestDto';
import { GetTransactionSummaryRequestDto } from '../dto/requests/GetTransactionSummaryRequestDto';
import { GetTransactionByIdRequestDto } from '../dto/requests/GetTransactionByIdRequestDto';
import { GetTransactionsResponseDto } from '../dto/responses/GetTransactionsResponseDto';
import { TransactionSummaryResponseDto } from '../dto/responses/TransactionSummaryResponseDto';
import { TransactionResponseDto } from '../dto/responses/TransactionResponseDto';
import { SuccessResponseDto, ErrorResponseDto } from '@lightning-pos/http-response';
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
      const requestDto = GetTransactionsRequestDto.from(req.query);
      const result = await getTransactionsUseCase.execute(requestDto.page, requestDto.limit, requestDto.filter);
      res.json(SuccessResponseDto.of(GetTransactionsResponseDto.fromResult(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  // Registered before /:id so "summary" isn't swallowed as a transaction id param.
  router.get('/summary', async (req, res) => {
    try {
      const requestDto = GetTransactionSummaryRequestDto.from(req.query);
      const result = await getTransactionSummaryUseCase.execute({
        period: requestDto.period,
        startDate: requestDto.startDate,
        endDate: requestDto.endDate,
        storeId: requestDto.storeId,
      });
      res.json(SuccessResponseDto.of(TransactionSummaryResponseDto.fromResult(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const requestDto = GetTransactionByIdRequestDto.from(req.params);
      const transaction = await getTransactionByIdUseCase.execute(requestDto.id);
      res.json(SuccessResponseDto.of(TransactionResponseDto.fromEntity(transaction)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      if (error instanceof NotFoundError) {
        res.status(404).json(ErrorResponseDto.of('404', error.message));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  return router;
}
