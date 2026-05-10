import api from '../../infrastructure/api/axiosInstance';
import type { Transaction, TransactionRepository, TransactionFilter } from '../../domain/repositories/TransactionRepository';

export class ApiTransactionRepository implements TransactionRepository {
  private readonly baseUrl = 'http://localhost:3006/v1/transactions';

  async getTransactions(page: number, limit: number, filter?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }> {
    const response = await api.get<{ transactions: any[]; total: number }>(this.baseUrl, {
      params: { 
        page, 
        limit,
        ...filter
      }
    });

    return {
      transactions: response.data.transactions.map((t: any) => ({
        id: t.id.toString(),
        orderId: t.orderId,
        amount: t.amount,
        paymentMethod: t.paymentMethod,
        status: t.status,
        createdAt: t.createdAt,
        staffName: t.staffName,
      })),
      total: response.data.total,
    };
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get<any>(`${this.baseUrl}/${id}`);
    const t = response.data;
    
    return {
      id: t.id.toString(),
      orderId: t.orderId,
      amount: t.amount,
      paymentMethod: t.paymentMethod,
      status: t.status,
      createdAt: t.createdAt,
      staffName: t.staffName,
    };
  }
}

