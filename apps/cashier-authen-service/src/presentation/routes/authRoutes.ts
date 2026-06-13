import { Router } from 'express';
import { LoginUseCase, UnauthorizedError } from '../../domain/use-cases/LoginUseCase';
import { authMiddleware } from '../middleware/authMiddleware';

export function authRoutes(loginUseCase: LoginUseCase): Router {
  const router = Router();

  router.post('/login', async (req, res) => {
    try {
      const { username, pin } = req.body as { username: string; pin: string };
      const result = await loginUseCase.execute(username, pin);
      res.json(result);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/profile', authMiddleware, (req, res) => {
    res.json((req as any).user);
  });

  return router;
}
