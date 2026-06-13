import { OrderStatus } from '../entities/Order';
import { IOrderRepository } from '../repositories/IOrderRepository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: string, data: UpdateOrderStatusInput) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Order with ID ${id} not found`);
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
