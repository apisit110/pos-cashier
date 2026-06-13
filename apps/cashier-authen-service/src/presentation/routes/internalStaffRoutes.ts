import { Router } from 'express';
import { GetStaffByIdUseCase } from '../../domain/use-cases/GetStaffByIdUseCase';

export function internalStaffRoutes(getStaffByIdUseCase: GetStaffByIdUseCase): Router {
  const router = Router();

  router.get('/:id', async (req, res) => {
    try {
      const staff = await getStaffByIdUseCase.execute(parseInt(req.params.id));
      if (!staff) {
        res.status(404).json({ message: 'Staff not found' });
        return;
      }
      res.json({ id: staff.id, username: staff.username, fullName: staff.fullName });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  return router;
}
