import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IOrderSyncGateway } from '../../domain/repositories/IOrderSyncGateway';
import { SyncState } from '../../domain/entities/SyncState';

export class SyncOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderSyncGateway: IOrderSyncGateway,
  ) {}

  /** returns `syncState` of the push, null when missing or the order is not found */
  async execute(orderId: string): Promise<SyncState | null> {
    console.log(`Executing sync for order: ${orderId}`);

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return null;
    }

    try {
      const syncState = await this.orderSyncGateway.syncOrder(order);
      await this.orderRepository.markAsSynced(orderId);
      console.log(`Order ${orderId} synced successfully.`);
      return syncState;
    } catch (error: any) {
      console.error(`Failed to sync order ${orderId}: ${error.message}`);
      throw error;
    }
  }
}
