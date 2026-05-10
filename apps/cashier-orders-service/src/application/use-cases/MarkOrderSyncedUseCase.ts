import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { OrderRepository } from '../interfaces/OrderRepository';

@Injectable()
export class MarkOrderSyncedUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    order.isSynced = true;
    await this.orderRepository.update(order);
    return { success: true };
  }
}
