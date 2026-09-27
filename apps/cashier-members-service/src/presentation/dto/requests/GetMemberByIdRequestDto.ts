import { z } from 'zod';

export const GetMemberByIdRequestSchema = z.object({
  id: z.string().min(1),
});

export class GetMemberByIdRequestDto {
  private constructor(readonly id: string) {}

  static from(params: unknown): GetMemberByIdRequestDto {
    const parsed = GetMemberByIdRequestSchema.parse(params);
    return new GetMemberByIdRequestDto(parsed.id);
  }
}
