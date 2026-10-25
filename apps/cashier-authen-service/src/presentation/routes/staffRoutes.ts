import { Router } from 'express';
import { z } from 'zod';
import { GetStaffsUseCase } from '../../application/usecases/GetStaffsUseCase';
import { CreateStaffUseCase } from '../../application/usecases/CreateStaffUseCase';
import { SyncStaffsUseCase } from '../../application/usecases/SyncStaffsUseCase';
import { GetStaffsRequestDto } from '../dto/requests/GetStaffsRequestDto';
import { CreateStaffRequestDto } from '../dto/requests/CreateStaffRequestDto';
import { GetStaffsResponseDto } from '../dto/responses/GetStaffsResponseDto';
import { StaffResponseDto } from '../dto/responses/StaffResponseDto';
import { SyncStaffsResponseDto } from '../dto/responses/SyncStaffsResponseDto';
import { SuccessResponseDto, ErrorResponseDto } from '@lightning-pos/http-response';
import { requireScope } from '../middleware/authMiddleware';

export function staffRoutes(
  getStaffsUseCase: GetStaffsUseCase,
  createStaffUseCase: CreateStaffUseCase,
  syncStaffsUseCase: SyncStaffsUseCase,
): Router {
  const router = Router();

  router.get('/', requireScope('staff:view'), async (req, res) => {
    try {
      const requestDto = GetStaffsRequestDto.from(req.query);
      const result = await getStaffsUseCase.execute(requestDto.page, requestDto.limit);
      res.json(SuccessResponseDto.of(GetStaffsResponseDto.fromResult(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.post('/', requireScope('staff:create'), async (req, res) => {
    try {
      const requestDto = CreateStaffRequestDto.from(req.body);
      const staff = await createStaffUseCase.execute(requestDto);
      res.status(201).json(SuccessResponseDto.of(StaffResponseDto.fromEntity(staff)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  router.post('/sync', requireScope('staff:create'), async (req, res) => {
    try {
      const result = await syncStaffsUseCase.execute();
      res.json(SuccessResponseDto.of(SyncStaffsResponseDto.fromResult(result)));
    } catch (error) {
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  return router;
}
