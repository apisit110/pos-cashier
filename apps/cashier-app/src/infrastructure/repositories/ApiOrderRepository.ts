import api from '../api/axiosInstance';
import type { PromotionResult } from '../../domain/use-cases/CalculatePromotionUseCase';

export interface OrderItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export class ApiOrderRepository {
  async calculatePromotions(items: OrderItemDto[], memberId?: string): Promise<PromotionResult> {
    const response = await api.post('/orders/calculate', { items, memberId });
    return {
      appliedPromotions: response.data.appliedPromotions,
      finalTotal: response.data.total,
    };
  }

  async checkout(data: {
    items: OrderItemDto[];
    memberId?: string;
    paymentMethod: 'CASH';
    receivedAmount?: number;
    idempotencyKey?: string;
  }): Promise<any> {
    try {
      const response = await api.post('/orders/checkout', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Checkout failed');
    }
  }
}
