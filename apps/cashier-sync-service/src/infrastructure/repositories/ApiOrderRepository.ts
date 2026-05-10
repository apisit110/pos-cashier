import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OrderRepository } from '../../application/interfaces/OrderRepository';

@Injectable()
export class ApiOrderRepository implements OrderRepository {
  private readonly baseUrl = 'http://localhost:3002/internal/v1/orders';

  async findById(id: string): Promise<any> {
    try {
      // Note: In production, you would include a service-to-service token
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async markAsSynced(id: string): Promise<void> {
    await axios.patch(`${this.baseUrl}/${id}/synced`);
  }
}
