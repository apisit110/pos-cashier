import type { Transaction, TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class MockTransactionRepository implements TransactionRepository {
  private transactions: Transaction[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      amount: 150.50,
      paymentMethod: 'cash',
      status: 'success',
      createdAt: new Date().toISOString(),
      staffName: 'Admin Manager'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      amount: 45.00,
      paymentMethod: 'qr_promptpay',
      status: 'success',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      staffName: 'Cashier One'
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      amount: 220.00,
      paymentMethod: 'credit_card',
      status: 'success',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      staffName: 'Admin Manager'
    },
    {
      id: '4',
      orderNumber: 'ORD-004',
      amount: 89.90,
      paymentMethod: 'cash',
      status: 'failed',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      staffName: 'Cashier Two'
    },
    {
      id: '5',
      orderNumber: 'ORD-005',
      amount: 1200.00,
      paymentMethod: 'credit_card',
      status: 'success',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      staffName: 'Admin Manager'
    }
  ];

  async getTransactions(page: number, limit: number): Promise<{ transactions: Transaction[]; total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      transactions: this.transactions.slice(start, end),
      total: this.transactions.length
    };
  }
}
