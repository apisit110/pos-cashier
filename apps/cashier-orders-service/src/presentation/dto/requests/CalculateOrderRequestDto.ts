import { z } from 'zod';

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const CalculateOrderRequestSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
  memberId: z.string().min(1).optional(),
});

export class CalculateOrderRequestDto {
  private constructor(
    readonly items: { productId: string; quantity: number }[],
    readonly memberId?: string,
  ) {}

  static from(payload: unknown): CalculateOrderRequestDto {
    const parsed = CalculateOrderRequestSchema.parse(payload);
    return new CalculateOrderRequestDto(parsed.items, parsed.memberId);
  }
}
