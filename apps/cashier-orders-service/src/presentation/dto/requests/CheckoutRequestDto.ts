import { z } from 'zod';
import { OrderItemSchema } from './CalculateOrderRequestDto';

export const CheckoutRequestSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
  memberId: z.string().min(1).optional(),
  paymentMethod: z.string().min(1),
  receivedAmount: z.number().nonnegative().optional(),
  idempotencyKey: z.string().min(1).optional(),
});

export class CheckoutRequestDto {
  private constructor(
    readonly items: { productId: string; quantity: number }[],
    readonly paymentMethod: string,
    readonly memberId?: string,
    readonly receivedAmount?: number,
    readonly idempotencyKey?: string,
  ) {}

  static from(payload: unknown): CheckoutRequestDto {
    const parsed = CheckoutRequestSchema.parse(payload);
    return new CheckoutRequestDto(
      parsed.items,
      parsed.paymentMethod,
      parsed.memberId,
      parsed.receivedAmount,
      parsed.idempotencyKey,
    );
  }
}
