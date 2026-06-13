import axios from 'axios';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

export class ApiTransactionRepositoryImpl implements ITransactionRepository {
  private readonly baseUrl = 'http://localhost:3006/internal/v1/transactions';

  async findById(id: string): Promise<any> {
    try {
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
