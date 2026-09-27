import { z } from 'zod';

export const ProductIdParamSchema = z.object({
  id: z.string().min(1),
});

export class ProductIdParamRequestDto {
  private constructor(readonly id: string) {}

  static from(params: unknown): ProductIdParamRequestDto {
    const parsed = ProductIdParamSchema.parse(params);
    return new ProductIdParamRequestDto(parsed.id);
  }
}
