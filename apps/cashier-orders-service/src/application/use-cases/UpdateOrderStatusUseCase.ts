import { Injectable, NotFoundException } from '@nestjs/common';
import type { OrderRepository } from '../interfaces/OrderRepository';
import { OrderStatus } from '../../domain/entities/Order';

export class UpdateOrderStatusDto {
  status: OrderStatus;
}

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string, data: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (data.status === OrderStatus.PAID) {
      order.markAsPaid();
    } else if (data.status === OrderStatus.CANCELLED) {
      order.cancel();
    } else {
      order.status = data.status;
    }

    await this.orderRepository.update(order);
    return order;
  }
}
