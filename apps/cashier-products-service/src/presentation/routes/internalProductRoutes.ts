import { Router } from 'express';
import { z } from 'zod';
import { GetProductByIdUseCase, NotFoundError } from '../../application/usecases/GetProductByIdUseCase';
import { ProductIdParamRequestDto } from '../dto/requests/ProductIdParamRequestDto';
import { ProductResponseDto } from '../dto/responses/ProductResponseDto';
import { SuccessResponseDto, ErrorResponseDto } from '@lightning-pos/http-response';

export function internalProductRoutes(getProductByIdUseCase: GetProductByIdUseCase): Router {
  const router = Router();

  router.get('/:id', async (req, res) => {
    try {
      const requestDto = ProductIdParamRequestDto.from(req.params);
      const product = await getProductByIdUseCase.execute(requestDto.id);
      res.json(SuccessResponseDto.of(ProductResponseDto.fromEntity(product)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(ErrorResponseDto.of('400', 'Validation failed', JSON.stringify(error.issues)));
        return;
      }
      if (error instanceof NotFoundError) {
        res.status(404).json(ErrorResponseDto.of('404', error.message));
        return;
      }
      res.status(500).json(ErrorResponseDto.of('500', (error as Error).message));
    }
  });

  return router;
}
