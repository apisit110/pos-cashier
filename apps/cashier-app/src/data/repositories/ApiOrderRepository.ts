import type { PromotionResult } from '../../application/use-cases/CalculatePromotionUseCase';
import api from '../../infrastructure/api/axiosInstance';

export interface OrderItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export class ApiOrderRepository {
  private readonly baseUrl = 'http://localhost:3002/v1/orders';

  private getAuthHeaders() {
    const sessionStr = localStorage.getItem('lightning_pos_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.accessToken) {
          return { 'Authorization': `Bearer ${session.accessToken}` };
        }
      } catch (e) {
        console.error('Error parsing session for auth headers', e);
      }
    }
    return {};
  }

  async calculatePromotions(items: OrderItemDto[], memberId?: string): Promise<PromotionResult> {
    try {
      const response = await api.post(`${this.baseUrl}/calculate`, 
        { items, memberId }, 
        { headers: this.getAuthHeaders() }
      );
      const data = response.data;
      return {
        appliedPromotions: data.appliedPromotions,
        finalTotal: data.total
      };
    } catch (error) {
      console.error('Error calculating promotions:', error);
      throw error;
    }
  }

  async checkout(data: {
    items: OrderItemDto[];
    memberId?: string;
    paymentMethod: 'CASH' | 'CREDIT' | 'QR';
    receivedAmount?: number;
  }): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/checkout`, data, { 
        headers: this.getAuthHeaders() 
      });
      return response.data;
    } catch (error: any) {
      console.error('Error during checkout:', error);
      throw new Error(error.response?.data?.message || 'Checkout failed');
    }
  }
}
