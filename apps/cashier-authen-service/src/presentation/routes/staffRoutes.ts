import { Router } from 'express';
import { GetStaffsUseCase } from '../../domain/use-cases/GetStaffsUseCase';
import { CreateStaffUseCase } from '../../domain/use-cases/CreateStaffUseCase';
import { SyncStaffsUseCase } from '../../domain/use-cases/SyncStaffsUseCase';

export function staffRoutes(
  getStaffsUseCase: GetStaffsUseCase,
  createStaffUseCase: CreateStaffUseCase,
  syncStaffsUseCase: SyncStaffsUseCase,
): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const page = parseInt((req.query.page as string) ?? '1');
      const limit = parseInt((req.query.limit as string) ?? '10');
      const result = await getStaffsUseCase.execute(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const body = req.body as { fullName: string; roleId: number; pin: string };
      const staff = await createStaffUseCase.execute(body);
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

  router.post('/sync', async (req, res) => {
    try {
      const result = await syncStaffsUseCase.execute();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  return router;
}
