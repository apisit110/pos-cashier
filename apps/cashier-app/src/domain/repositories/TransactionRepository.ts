export interface Transaction {
  id: string;
  orderNumber: string;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'qr_promptpay';
  status: 'success' | 'failed' | 'refunded';
  createdAt: string;
  staffName: string;
}

export interface TransactionRepository {
  getTransactions(page: number, limit: number): Promise<{ transactions: Transaction[]; total: number }>;
}
