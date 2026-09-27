import { z } from 'zod';
import { OrderStatus } from '../../../domain/entities/Order';

export const UpdateOrderStatusRequestSchema = z.object({
  status: z.enum([OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.CANCELLED]),
});

export class UpdateOrderStatusRequestDto {
  private constructor(readonly status: OrderStatus) {}

  static from(payload: unknown): UpdateOrderStatusRequestDto {
    const parsed = UpdateOrderStatusRequestSchema.parse(payload);
    return new UpdateOrderStatusRequestDto(parsed.status);
  }
}
