import { getHttpClient } from '../http/axiosInstance';
import { IOrderSyncGateway } from '../../domain/repositories/IOrderSyncGateway';
import { SyncState } from '../../domain/entities/SyncState';
import { toSyncState } from './HttpSyncStateGatewayImpl';

export class HttpOrderSyncGatewayImpl implements IOrderSyncGateway {
  async syncOrder(order: any): Promise<SyncState | null> {
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
      const response = await getHttpClient().post('/push/orders', payload);
      console.log(`Service center response: ${JSON.stringify(response.data)}`);

      const result = response.data?.results?.[0];
      if (result?.status === 'error') {
        throw new Error(`pos-center failed to sync order ${order.id}`);
      }

      return toSyncState(response.data?.syncState);
    } catch (error: any) {
      console.error(`Failed to sync order to service center: ${error.message}`);
      if (error.response) {
        console.error(`Error response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}
