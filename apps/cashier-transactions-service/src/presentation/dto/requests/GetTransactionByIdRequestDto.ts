import { z } from 'zod';

export const GetTransactionByIdParamsSchema = z.object({
  id: z.string().min(1),
});

export class GetTransactionByIdRequestDto {
  private constructor(readonly id: string) {}

  static from(params: unknown): GetTransactionByIdRequestDto {
    const parsed = GetTransactionByIdParamsSchema.parse(params);
    return new GetTransactionByIdRequestDto(parsed.id);
  }
}
