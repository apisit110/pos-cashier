import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order, OrderItem } from '../../domain/entities/Order';
import type { OrderRepository } from '../interfaces/OrderRepository';

export class CreateOrderDto {
  items: { productId: string; quantity: number; price: number }[];
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(data: CreateOrderDto, staffId: string): Promise<Order> {
    const items = data.items.map(
      (item) => new OrderItem(item.productId, item.quantity, item.price)
    );
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const merchantId = this.configService.get<string>('MERCHANT_ID', 'DEFAULT_MERCHANT');
    const storeId = this.configService.get<string>('STORE_ID', 'DEFAULT_STORE');
    const terminalId = this.configService.get<string>('TERMINAL_ID', 'DEFAULT_TERMINAL');

    const order = new Order(
      Math.random().toString(36).substring(2, 9),
      merchantId,
      storeId,
      items,
      totalAmount,
      staffId,
      new Date(),
      terminalId
    );

    await this.orderRepository.save(order);
    return order;
  }
}
