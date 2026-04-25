import axios from 'axios';
import type { Transaction, TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class ApiTransactionRepository implements TransactionRepository {
  private readonly baseUrl = 'http://localhost:3006/v1/transactions';

  async getTransactions(page: number, limit: number): Promise<{ transactions: Transaction[]; total: number }> {
    const response = await axios.get<{ transactions: any[]; total: number }>(this.baseUrl, {
      params: { page, limit }
    });

    return {
      transactions: response.data.transactions.map((t: any) => ({
        id: t.id.toString(),
        orderNumber: t.orderNumber,
        amount: t.amount,
        paymentMethod: t.paymentMethod,
        status: t.status,
        createdAt: t.createdAt,
        staffName: t.staffName,
      })),
      total: response.data.total,
    };
  }
}
