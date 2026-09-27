import { Order } from '../../../domain/entities/Order';
import { OrderResponseDto } from './OrderResponseDto';

export class CheckoutResponseDto {
  private constructor(
    readonly order: OrderResponseDto,
    readonly changeAmount: number,
  ) {}

  static fromEntity(order: Order & { changeAmount: number }): CheckoutResponseDto {
    return new CheckoutResponseDto(OrderResponseDto.fromEntity(order), order.changeAmount);
  }

  toJSON() {
    return {
      ...this.order.toJSON(),
      changeAmount: this.changeAmount,
    };
  }
}
