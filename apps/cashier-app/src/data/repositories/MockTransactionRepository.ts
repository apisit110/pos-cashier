import type { Transaction, TransactionRepository, TransactionFilter } from '../../domain/repositories/TransactionRepository';

export class MockTransactionRepository implements TransactionRepository {
  private transactions: Transaction[] = [
    {
      id: '1',
      orderId: 'ORD-001',
      amount: 150.50,
      paymentMethod: 'cash',
      status: 'success',
      createdAt: new Date().toISOString(),
      staffName: 'Admin Manager'
    },
    {
      id: '2',
      orderId: 'ORD-002',
      amount: 45.00,
      paymentMethod: 'qr_promptpay',
      status: 'success',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      staffName: 'Cashier One'
    },
    {
      id: '3',
      orderId: 'ORD-003',
      amount: 220.00,
      paymentMethod: 'credit_card',
      status: 'success',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      staffName: 'Admin Manager'
    },
    {
      id: '4',
      orderId: 'ORD-004',
      amount: 89.90,
      paymentMethod: 'cash',
      status: 'failed',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      staffName: 'Cashier Two'
    },
    {
      id: '5',
      orderId: 'ORD-005',
      amount: 1200.00,
      paymentMethod: 'credit_card',
      status: 'success',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      staffName: 'Admin Manager'
    }
  ];

  async getTransactions(page: number, limit: number, filter?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }> {
    let filtered = [...this.transactions];

    if (filter) {
      if (filter.id) {
        filtered = filtered.filter(t => t.id.includes(filter.id!));
      }
      if (filter.startDate) {
        filtered = filtered.filter(t => new Date(t.createdAt) >= new Date(filter.startDate!));
      }
      if (filter.endDate) {
        filtered = filtered.filter(t => new Date(t.createdAt) <= new Date(filter.endDate!));
      }
      if (filter.method) {
        filtered = filtered.filter(t => t.paymentMethod === filter.method);
      }
      if (filter.status) {
        filtered = filtered.filter(t => t.status === filter.status);
      }
      if (filter.amountRange) {
        filtered = filtered.filter(t => {
          switch (filter.amountRange) {
            case '0-99': return t.amount >= 0 && t.amount <= 99;
            case '100-299': return t.amount >= 100 && t.amount <= 299;
            case '300-499': return t.amount >= 300 && t.amount <= 499;
            case '500+': return t.amount >= 500;
            default: return true;
          }
        });
      }
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      transactions: filtered.slice(start, end),
      total: filtered.length
    };
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = this.transactions.find(t => parseInt(t.id) === id);
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
