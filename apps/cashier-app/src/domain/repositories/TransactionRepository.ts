export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'qr_promptpay';
  status: 'success' | 'failed' | 'refunded';
  createdAt: string;
  staffName: string;
}

export interface TransactionFilter {
  id?: string;
  startDate?: string;
  endDate?: string;
  method?: string;
  amountRange?: '0-99' | '100-299' | '300-499' | '500+';
  status?: string;
}

export interface TransactionRepository {
  getTransactions(page: number, limit: number, filter?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }>;
  getTransactionById(id: string): Promise<Transaction>;
}
