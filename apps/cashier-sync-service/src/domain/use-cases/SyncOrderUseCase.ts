import { IOrderRepository } from '../repositories/IOrderRepository';
import { IOrderSyncGateway } from '../repositories/IOrderSyncGateway';

export class SyncOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderSyncGateway: IOrderSyncGateway,
  ) {}

  async execute(orderId: string): Promise<void> {
    console.log(`Executing sync for order: ${orderId}`);

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return;
    }

    try {
      await this.orderSyncGateway.syncOrder(order);
      await this.orderRepository.markAsSynced(orderId);
      console.log(`Order ${orderId} synced successfully.`);
    } catch (error: any) {
      console.error(`Failed to sync order ${orderId}: ${error.message}`);
      throw error;
    }
  }
}
