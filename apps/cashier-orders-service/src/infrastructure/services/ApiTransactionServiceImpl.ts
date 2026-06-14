import axios from 'axios';
import { ITransactionService, TransactionData } from '../../domain/repositories/ITransactionService';

export class ApiTransactionServiceImpl implements ITransactionService {
  private readonly baseUrl = 'http://localhost:3006/internal/v1/transactions';

  async createTransaction(data: TransactionData): Promise<string> {
    const response = await axios.post<{ id: string }>(this.baseUrl, data);
    console.log(`Transaction created for order ${data.orderId} via Transaction Service.`);
    return response.data.id;
  }
}
