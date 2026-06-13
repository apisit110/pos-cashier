import { Router } from 'express';
import { GetMemberByIdUseCase } from '../../domain/use-cases/GetMemberByIdUseCase';

export function memberRoutes(getMemberByIdUseCase: GetMemberByIdUseCase): Router {
  const router = Router();

  router.get('/:id', async (req, res) => {
    try {
      const member = await getMemberByIdUseCase.execute(req.params.id);
      if (!member) {
        res.status(404).json({ message: `Member with ID ${req.params.id} not found.` });
        return;
      }
      res.json({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        fullName: member.fullName,
        points: member.points,
      });
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}
