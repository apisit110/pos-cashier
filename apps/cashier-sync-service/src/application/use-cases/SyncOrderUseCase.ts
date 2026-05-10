import { Inject, Injectable, Logger } from '@nestjs/common';
import type { OrderSyncRepository } from '../interfaces/OrderSyncRepository';
import type { OrderRepository } from '../interfaces/OrderRepository';

@Injectable()
export class SyncOrderUseCase {
  private readonly logger = new Logger(SyncOrderUseCase.name);

  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('OrderSyncRepository')
    private readonly orderSyncRepository: OrderSyncRepository,
  ) {}

  async execute(orderId: string): Promise<void> {
    this.logger.log(`Executing sync for order: ${orderId}`);

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.error(`Order ${orderId} not found`);
      return;
    }

    try {
      await this.orderSyncRepository.syncOrder(order);
      await this.orderRepository.markAsSynced(orderId);
      this.logger.log(`Order ${orderId} synced successfully.`);
    } catch (error: any) {
      this.logger.error(`Failed to sync order ${orderId}: ${error.message}`);
      throw error;
    }
  }
}
