export interface TransactionData {
  orderId: string;
  merchantId: string;
  storeId: string;
  terminalId?: string;
  amount: number;
  paymentMethod: string;
  status: string;
  staffName: string;
}

export interface TransactionService {
  createTransaction(data: TransactionData): Promise<string>;
}
