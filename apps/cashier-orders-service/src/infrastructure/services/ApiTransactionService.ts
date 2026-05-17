import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TransactionService, TransactionData } from '../../application/interfaces/TransactionService';

@Injectable()
export class ApiTransactionService implements TransactionService {
  private readonly baseUrl = 'http://localhost:3006/internal/v1/transactions';

  async createTransaction(data: TransactionData): Promise<string> {
    const response = await axios.post<string>(this.baseUrl, data);
    console.log(`Transaction created for order ${data.orderId} via Transaction Service.`);
    return response.data;
  }
}
