import { Router } from 'express';
import { z } from 'zod';
import { GetStaffsUseCase } from '../../domain/use-cases/GetStaffsUseCase';
import { CreateStaffUseCase } from '../../domain/use-cases/CreateStaffUseCase';
import { SyncStaffsUseCase } from '../../domain/use-cases/SyncStaffsUseCase';
import { requireScope } from '../middleware/authMiddleware';

const createStaffSchema = z.object({
  fullName: z.string().min(1),
  roleId: z.number().int().positive(),
  pin: z.string().min(4),
});

export function staffRoutes(
  getStaffsUseCase: GetStaffsUseCase,
  createStaffUseCase: CreateStaffUseCase,
  syncStaffsUseCase: SyncStaffsUseCase,
): Router {
  const router = Router();

  router.get('/', requireScope('staff:view'), async (req, res) => {
    try {
      const page = parseInt((req.query.page as string) ?? '1');
      const limit = parseInt((req.query.limit as string) ?? '10');
      const result = await getStaffsUseCase.execute(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/', requireScope('staff:create'), async (req, res) => {
    const parsed = createStaffSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
      return;
    }

    try {
      const staff = await createStaffUseCase.execute(parsed.data);
      try {
        await syncStaffsUseCase.execute();
      } catch (syncError) {
        console.error('[staffRoutes] Failed to sync staffs after create:', syncError);
      }
      res.status(201).json(staff);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/sync', requireScope('staff:create'), async (req, res) => {
    try {
      const result = await syncStaffsUseCase.execute();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  return router;
}
