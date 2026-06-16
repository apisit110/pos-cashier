import { orderServiceClient } from '../http/orderServiceClient';
import { IOrderService, OrderServiceItem } from '../../domain/repositories/IOrderService';

export class ApiOrderServiceImpl implements IOrderService {
  async getOrderItems(orderId: string): Promise<OrderServiceItem[]> {
    try {
      const response = await orderServiceClient.get<{ items: OrderServiceItem[] }>(`/orders/${orderId}`);
      return response.data.items ?? [];
    } catch {
      return [];
    }
  }
}
