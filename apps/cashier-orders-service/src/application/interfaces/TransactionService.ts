export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'QR_PROMPTPAY';
export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface TransactionData {
  orderId: string;
  merchantId: string;
  storeId: string;
  terminalId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  staffName: string;
}

export interface TransactionService {
  createTransaction(data: TransactionData): Promise<string>;
}
