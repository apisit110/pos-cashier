import { Router } from 'express';
import { z } from 'zod';
import { ActivateTerminalUseCase, NotFoundError, ConflictError } from '../../application/usecases/ActivateTerminalUseCase';
import { ActivateTerminalRequestDto } from '../dto/requests/ActivateTerminalRequestDto';
import { ActivateTerminalResponseDto } from '../dto/responses/ActivateTerminalResponseDto';
import { SuccessResponseDto, ErrorResponseDto } from '@lightning-pos/http-response';

export function terminalRoutes(activateTerminalUseCase: ActivateTerminalUseCase): Router {
  const router = Router();

  router.post('/activate', async (req, res) => {
    try {
      const requestDto = ActivateTerminalRequestDto.from(req.body);
      const result = await activateTerminalUseCase.execute(requestDto.tid);
      res.json(SuccessResponseDto.of(ActivateTerminalResponseDto.fromResult(result)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      if (error instanceof NotFoundError) {
        res.status(404).json(ErrorResponseDto.of('404', error.message));
        return;
      }
      if (error instanceof ConflictError) {
        res.status(409).json(ErrorResponseDto.of('409', error.message));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', 'Internal server error'));
    }
  });

  return router;
}
