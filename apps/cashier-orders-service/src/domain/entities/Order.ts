export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number
  ) {}
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly items: OrderItem[],
    public readonly totalAmount: number,
    public readonly staffId: string,
    public readonly createdAt: Date,
    public status: OrderStatus = OrderStatus.PENDING,
    public readonly memberId?: string
  ) {}

  markAsPaid() {
    this.status = OrderStatus.PAID;
  }

  cancel() {
    this.status = OrderStatus.CANCELLED;
  }
}
