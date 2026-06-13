import { IOrderRepository } from '../repositories/IOrderRepository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class MarkOrderSyncedUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order ${orderId} not found`);
    }

    order.isSynced = true;
    await this.orderRepository.update(order);
    return { success: true };
  }
}
