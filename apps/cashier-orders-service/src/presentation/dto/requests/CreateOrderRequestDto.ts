import { z } from 'zod';

export const CreateOrderRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
      }),
    )
    .min(1),
});

export class CreateOrderRequestDto {
  private constructor(readonly items: { productId: string; quantity: number; price: number }[]) {}

  static from(payload: unknown): CreateOrderRequestDto {
    const parsed = CreateOrderRequestSchema.parse(payload);
    return new CreateOrderRequestDto(parsed.items);
  }
}
