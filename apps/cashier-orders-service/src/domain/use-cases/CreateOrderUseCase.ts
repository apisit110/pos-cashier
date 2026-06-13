import { Order, OrderItem } from '../entities/Order';
import { IOrderRepository } from '../repositories/IOrderRepository';

export interface CreateOrderInput {
  items: { productId: string; quantity: number; price: number }[];
}

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(data: CreateOrderInput, staffId: string): Promise<Order> {
    const items = data.items.map((item) => new OrderItem(item.productId, item.quantity, item.price));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const merchantId = process.env.MERCHANT_ID ?? 'DEFAULT_MERCHANT';
    const storeId = process.env.STORE_ID ?? 'DEFAULT_STORE';
    const terminalId = process.env.TERMINAL_ID ?? 'DEFAULT_TERMINAL';

    const order = new Order(
      Math.random().toString(36).substring(2, 9),
      merchantId,
      storeId,
      items,
      totalAmount,
      staffId,
      new Date(),
      terminalId,
    );

    await this.orderRepository.save(order);
    return order;
  }
}
