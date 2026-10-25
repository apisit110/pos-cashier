import { Order, OrderItem } from '../../domain/entities/Order';
import { Terminal } from '../../domain/entities/Terminal';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';

export interface CreateOrderInput {
  items: { productId: string; quantity: number; price: number }[];
}

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(data: CreateOrderInput, staffId: string, terminal: Terminal): Promise<Order> {
    const items = data.items.map((item) => new OrderItem(item.productId, item.quantity, item.price));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { mid: merchantId, sid: storeId, tid: terminalId } = terminal;

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
