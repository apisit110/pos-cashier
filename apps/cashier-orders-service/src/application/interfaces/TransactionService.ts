export interface TransactionData {
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  status: string;
  staffName: string;
}

export interface TransactionService {
  createTransaction(data: TransactionData): Promise<void>;
}
