import { z } from 'zod';

export const CreateProductRequestSchema = z.object({
  barcode: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  brand: z.string().nullish(),
});

export class CreateProductRequestDto {
  private constructor(
    readonly barcode: string,
    readonly name: string,
    readonly price: number,
    readonly brand?: string | null,
  ) {}

  static from(payload: unknown): CreateProductRequestDto {
    const parsed = CreateProductRequestSchema.parse(payload);
    return new CreateProductRequestDto(parsed.barcode, parsed.name, parsed.price, parsed.brand);
  }
}
