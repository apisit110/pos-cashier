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
      staffName: 'Admin Manager',
      orderItems: [
        { productId: 'P001', productName: 'Americano (Hot)', quantity: 2, unitPrice: 45.00, total: 90.00 },
        { productId: 'P002', productName: 'Croissant', quantity: 1, unitPrice: 35.00, total: 35.00 },
        { productId: 'P003', productName: 'Orange Juice', quantity: 1, unitPrice: 25.50, total: 25.50 },
      ]
    },
    {
      id: '2',
      orderId: 'ORD-002',
      amount: 45.00,
      paymentMethod: 'qr_promptpay',
      status: 'success',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      staffName: 'Cashier One',
      orderItems: [
        { productId: 'P001', productName: 'Americano (Hot)', quantity: 1, unitPrice: 45.00, total: 45.00 },
      ]
    },
    {
      id: '3',
      orderId: 'ORD-003',
      amount: 220.00,
      paymentMethod: 'credit_card',
      status: 'success',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      staffName: 'Admin Manager',
      orderItems: [
        { productId: 'P004', productName: 'Latte (Large)', quantity: 2, unitPrice: 55.00, total: 110.00 },
        { productId: 'P005', productName: 'Club Sandwich', quantity: 1, unitPrice: 75.00, total: 75.00 },
        { productId: 'P006', productName: 'Cheesecake Slice', quantity: 1, unitPrice: 35.00, total: 35.00 },
      ]
    },
    {
      id: '4',
      orderId: 'ORD-004',
      amount: 89.90,
      paymentMethod: 'cash',
      status: 'failed',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      staffName: 'Cashier Two',
      orderItems: [
        { productId: 'P007', productName: 'Cappuccino', quantity: 1, unitPrice: 50.00, total: 50.00 },
        { productId: 'P008', productName: 'Banana Bread', quantity: 1, unitPrice: 39.90, total: 39.90 },
      ]
    },
    {
      id: '5',
      orderId: 'ORD-005',
      amount: 1200.00,
      paymentMethod: 'credit_card',
      status: 'success',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      staffName: 'Admin Manager',
      orderItems: [
        { productId: 'P009', productName: 'Premium Coffee Set', quantity: 3, unitPrice: 180.00, total: 540.00 },
        { productId: 'P010', productName: 'Afternoon Tea Set', quantity: 2, unitPrice: 220.00, total: 440.00 },
        { productId: 'P011', productName: 'Sparkling Water (L)', quantity: 4, unitPrice: 55.00, total: 220.00 },
      ]
    }
  ];

  async getTransactions(page: number, limit: number, filter?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }> {
    let filtered = [...this.transactions];

    if (filter) {
      if (filter.id) {
        filtered = filtered.filter(t => t.id.includes(filter.id!));
      }
      if (filter.orderId) {
        filtered = filtered.filter(t => t.orderId.toLowerCase().includes(filter.orderId!.toLowerCase()));
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

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = this.transactions.find(t => t.id === id);
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
