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
          order_id: order.id,
          merchant_id: order.merchantId,
          store_id: order.storeId,
          terminal_id: order.terminalId ?? null,
          staff_id: order.staffId,
          member_id: order.memberId ?? null,
          total_amount: order.totalAmount,
          status: order.status,
          items: order.items.map((item: any) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          created_at: order.createdAt,
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
