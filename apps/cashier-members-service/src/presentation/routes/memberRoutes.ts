import { Router } from 'express';
import { z } from 'zod';
import { GetMemberByIdUseCase } from '../../application/usecases/GetMemberByIdUseCase';
import { GetMemberByIdRequestDto } from '../dto/requests/GetMemberByIdRequestDto';
import { MemberResponseDto } from '../dto/responses/MemberResponseDto';
import { SuccessResponseDto, ErrorResponseDto } from '@lightning-pos/http-response';

export function memberRoutes(getMemberByIdUseCase: GetMemberByIdUseCase): Router {
  const router = Router();

  router.get('/:id', async (req, res) => {
    try {
      const requestDto = GetMemberByIdRequestDto.from(req.params);
      const member = await getMemberByIdUseCase.execute(requestDto.id);
      if (!member) {
        res.status(404).json(ErrorResponseDto.of('404', `Member with ID ${requestDto.id} not found.`));
        return;
      }
      res.json(SuccessResponseDto.of(MemberResponseDto.fromEntity(member)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', 'Internal server error'));
    }
  });

  return router;
}
