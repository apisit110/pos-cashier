import axios from 'axios';
import { IOrderSyncGateway } from '../../domain/repositories/IOrderSyncGateway';

export class HttpOrderSyncGatewayImpl implements IOrderSyncGateway {
  private readonly serviceCenterUrl = 'http://localhost:4002/v1/sync/orders';

  async syncOrder(order: any): Promise<void> {
    console.log(`Syncing order ${order.id} to service center...`);

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
      console.log(`Service center response: ${JSON.stringify(response.data)}`);

      const result = response.data?.results?.[0];
      if (result?.status === 'error') {
        throw new Error(`pos-center failed to sync order ${order.id}`);
      }
    } catch (error: any) {
      console.error(`Failed to sync order to service center: ${error.message}`);
      if (error.response) {
        console.error(`Error response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}
