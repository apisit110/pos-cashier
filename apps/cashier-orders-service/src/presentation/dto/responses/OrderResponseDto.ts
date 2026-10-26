import { Order, OrderItem, OrderStatus } from '../../../domain/entities/Order';

export interface OrderItemJSON {
  productId: string;
  quantity: number;
  price: number;
}

function toItemJSON(item: OrderItem): OrderItemJSON {
  return { productId: item.productId, quantity: item.quantity, price: item.price };
}

export class OrderResponseDto {
  private constructor(
    readonly id: string,
    readonly merchantId: string,
    readonly storeId: string,
    readonly items: OrderItemJSON[],
    readonly totalAmount: number,
    readonly staffId: string,
    readonly createdAt: Date,
    readonly terminalId: string | undefined,
    readonly status: OrderStatus,
    readonly isSynced: boolean,
    readonly memberId: string | undefined,
    readonly idempotencyKey: string | undefined,
  ) {}

  static fromEntity(order: Order): OrderResponseDto {
    return new OrderResponseDto(
      order.id,
      order.merchantId,
      order.storeId,
      order.items.map(toItemJSON),
      order.totalAmount,
      order.staffId,
      order.createdAt,
      order.terminalId,
      order.status,
      order.isSynced,
      order.memberId,
      order.idempotencyKey,
    );
  }

  toJSON() {
    return {
      id: this.id,
      merchantId: this.merchantId,
      storeId: this.storeId,
      items: this.items,
      totalAmount: this.totalAmount,
      staffId: this.staffId,
      createdAt: this.createdAt,
      terminalId: this.terminalId,
      status: this.status,
      isSynced: this.isSynced,
      memberId: this.memberId,
      idempotencyKey: this.idempotencyKey,
    };
  }
}
