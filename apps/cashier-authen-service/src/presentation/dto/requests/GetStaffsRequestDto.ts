import { z } from 'zod';

export const GetStaffsRequestSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export class GetStaffsRequestDto {
  private constructor(
    readonly page: number,
    readonly limit: number,
  ) {}

  static from(query: unknown): GetStaffsRequestDto {
    const parsed = GetStaffsRequestSchema.parse(query);
    return new GetStaffsRequestDto(parsed.page, parsed.limit);
  }
}
