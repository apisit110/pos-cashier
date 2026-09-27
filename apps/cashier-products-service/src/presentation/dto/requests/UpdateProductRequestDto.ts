import { z } from 'zod';

export const UpdateProductRequestSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  brand: z.string().nullish(),
});

export class UpdateProductRequestDto {
  private constructor(
    readonly name: string,
    readonly price: number,
    readonly brand?: string | null,
  ) {}

  static from(payload: unknown): UpdateProductRequestDto {
    const parsed = UpdateProductRequestSchema.parse(payload);
    return new UpdateProductRequestDto(parsed.name, parsed.price, parsed.brand);
  }
}
