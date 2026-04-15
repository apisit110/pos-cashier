import { Injectable } from '@nestjs/common';
import { Order, OrderItem } from '../../domain/entities/Order';
import type { OrderRepository } from '../interfaces/OrderRepository';

export class CreateOrderDto {
  items: { productId: string; quantity: number; price: number }[];
}

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(data: CreateOrderDto, staffId: string): Promise<Order> {
    const items = data.items.map(
      (item) => new OrderItem(item.productId, item.quantity, item.price)
    );
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = new Order(
      Math.random().toString(36).substring(2, 9),
      items,
      totalAmount,
      staffId,
      new Date()
    );

    await this.orderRepository.save(order);
    return order;
  }
}
