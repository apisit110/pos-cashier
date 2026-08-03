import { Transaction } from '../entities/Transaction';

export interface TransactionFilter {
  id?: string;
  orderId?: string;
  startDate?: Date;
  endDate?: Date;
  method?: string;
  amountRange?: '0-99' | '100-299' | '300-499' | '500+';
  status?: string;
}

export type TransactionSummaryPeriod = 'hourly' | 'daily';

export interface TransactionSummaryFilter {
  period: TransactionSummaryPeriod;
  startDate: Date;
  endDate: Date;
  storeId?: string;
}

export interface TransactionSummaryBucket {
  bucket: string;
  orderCount: number;
  totalAmount: number;
}

export interface ITransactionRepository {
  findAll(page: number, limit: number, filter?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }>;
  findById(id: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
  getSummary(filter: TransactionSummaryFilter): Promise<TransactionSummaryBucket[]>;
}
