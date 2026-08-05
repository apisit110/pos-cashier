import { Router } from 'express';
import { z } from 'zod';
import { LoginUseCase, UnauthorizedError } from '../../domain/use-cases/LoginUseCase';
import { authMiddleware } from '../middleware/authMiddleware';

const loginSchema = z.object({
  username: z.string().min(1),
  pin: z.string().min(1),
});

export function authRoutes(loginUseCase: LoginUseCase): Router {
  const router = Router();

  router.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Validation failed', errors: parsed.error.issues });
      return;
    }

    try {
      const { username, pin } = parsed.data;
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
