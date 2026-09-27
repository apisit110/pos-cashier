import { z } from 'zod';

export const SyncProductsRequestSchema = z.object({
  mid: z.string().min(1).optional(),
  sid: z.string().min(1).optional(),
});

export class SyncProductsRequestDto {
  private constructor(
    readonly mid?: string,
    readonly sid?: string,
  ) {}

  static from(payload: unknown): SyncProductsRequestDto {
    const parsed = SyncProductsRequestSchema.parse(payload ?? {});
    return new SyncProductsRequestDto(parsed.mid, parsed.sid);
  }
}
