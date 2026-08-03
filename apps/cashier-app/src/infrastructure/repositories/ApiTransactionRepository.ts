import api from '../api/axiosInstance';
import type {
  Transaction,
  TransactionRepository,
  TransactionFilter,
  TransactionSummaryFilter,
  TransactionSummaryBucket,
} from '../../domain/repositories/TransactionRepository';

export class ApiTransactionRepository implements TransactionRepository {
  async getTransactions(page: number, limit: number, filter?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }> {
    const response = await api.get<{ transactions: any[]; total: number }>('/transactions', {
      params: { page, limit, ...filter },
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
    const response = await api.get<any>(`/transactions/${id}`);
    const t = response.data;
    return {
      id: t.id.toString(),
      orderId: t.orderId,
      amount: t.amount,
      paymentMethod: t.paymentMethod,
      status: t.status,
      createdAt: t.createdAt,
      staffName: t.staffName,
      orderItems: (t.orderItems ?? []).map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
    };
  }

  async getSummary(filter: TransactionSummaryFilter): Promise<TransactionSummaryBucket[]> {
    const response = await api.get<{ buckets: TransactionSummaryBucket[] }>('/transactions/summary', {
      params: filter,
    });

    return response.data.buckets;
  }
}
