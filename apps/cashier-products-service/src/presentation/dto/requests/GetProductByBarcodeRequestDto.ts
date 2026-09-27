import { z } from 'zod';

export const GetProductByBarcodeRequestSchema = z.object({
  barcode: z.string().min(1),
});

export class GetProductByBarcodeRequestDto {
  private constructor(readonly barcode: string) {}

  static from(params: unknown): GetProductByBarcodeRequestDto {
    const parsed = GetProductByBarcodeRequestSchema.parse(params);
    return new GetProductByBarcodeRequestDto(parsed.barcode);
  }
}
