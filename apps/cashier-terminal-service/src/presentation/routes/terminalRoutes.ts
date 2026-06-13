import { Router } from 'express';
import { ActivateTerminalUseCase, NotFoundError, ConflictError } from '../../domain/use-cases/ActivateTerminalUseCase';

export function terminalRoutes(activateTerminalUseCase: ActivateTerminalUseCase): Router {
  const router = Router();

  router.post('/activate', async (req, res) => {
    try {
      const { tid } = req.body as { tid: string };
      const result = await activateTerminalUseCase.execute(tid);
      res.json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ConflictError) {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}
