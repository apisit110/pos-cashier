import { z } from 'zod';

export const GetProductsRequestSchema = z.object({
  barcode: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  price: z.coerce.number().optional(),
});

export class GetProductsRequestDto {
  private constructor(
    readonly barcode?: string,
    readonly name?: string,
    readonly brand?: string,
    readonly price?: number,
  ) {}

  static from(query: unknown): GetProductsRequestDto {
    const parsed = GetProductsRequestSchema.parse(query);
    return new GetProductsRequestDto(parsed.barcode, parsed.name, parsed.brand, parsed.price);
  }
}
