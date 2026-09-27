import { Router } from 'express';
import { z } from 'zod';
import { LoginUseCase, UnauthorizedError } from '../../application/usecases/LoginUseCase';
import { LoginRequestDto } from '../dto/requests/LoginRequestDto';
import { LoginResponseDto } from '../dto/responses/LoginResponseDto';
import { ProfileResponseDto } from '../dto/responses/ProfileResponseDto';
import { SuccessResponseDto, ErrorResponseDto } from '@lightning-pos/http-response';
import { authMiddleware } from '../middleware/authMiddleware';

export function authRoutes(loginUseCase: LoginUseCase): Router {
  const router = Router();

  router.post('/login', async (req, res) => {
    try {
      const requestDto = LoginRequestDto.from(req.body);
      const result = await loginUseCase.execute(requestDto.username, requestDto.pin);
      res.json(SuccessResponseDto.of(LoginResponseDto.fromResult(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      if (error instanceof UnauthorizedError) {
        res.status(401).json(ErrorResponseDto.of('401', error.message));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', 'Internal server error'));
    }
  });

  router.get('/profile', authMiddleware, (req, res) => {
    const responseDto = ProfileResponseDto.fromTokenPayload((req as any).user);
    res.json(SuccessResponseDto.of(responseDto));
  });

  return router;
}
