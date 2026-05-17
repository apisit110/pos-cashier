import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { OrderSyncRepository } from '../../application/interfaces/OrderSyncRepository';

@Injectable()
export class HttpOrderSyncRepository implements OrderSyncRepository {
  private readonly logger = new Logger(HttpOrderSyncRepository.name);
  private readonly serviceCenterUrl = 'http://localhost:4002/v1/sync/orders';

  async syncOrder(order: any): Promise<void> {
    this.logger.log(`Syncing order ${order.id} to service center...`);

    const payload = {
      orders: [
        {
          posTempId: order.id,
          merchantId: order.merchantId,
          storeId: order.storeId,
          terminalId: order.terminalId ?? null,
          staffId: order.staffId,
          memberId: order.memberId ?? null,
          totalAmount: order.totalAmount,
          status: order.status,
          items: order.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          createdAt: order.createdAt,
        },
      ],
    };

    try {
      const response = await axios.post(this.serviceCenterUrl, payload);
      this.logger.log(`Service center response: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      this.logger.error(`Failed to sync order to service center: ${error.message}`);
      if (error.response) {
        this.logger.error(`Error response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}
