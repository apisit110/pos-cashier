import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TransactionService, TransactionData } from '../../application/interfaces/TransactionService';

@Injectable()
export class ApiTransactionService implements TransactionService {
  private readonly baseUrl = 'http://localhost:3006/v1/transactions';

  async createTransaction(data: TransactionData): Promise<void> {
    try {
      await axios.post(this.baseUrl, data);
      console.log(`Transaction created for order ${data.orderNumber} via Transaction Service.`);
    } catch (error) {
      console.error(`Failed to create transaction for order ${data.orderNumber}:`, (error as Error).message);
      // We don't necessarily want to fail the checkout if transaction recording fails, 
      // but in some systems, this should be atomic or eventually consistent.
      // For now, we just log the error.
    }
  }
}
