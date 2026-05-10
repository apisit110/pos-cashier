import { Transaction } from '../entities/Transaction';

export interface TransactionFilter {
  id?: string;
  startDate?: Date;
  endDate?: Date;
  method?: string;
  amountRange?: '0-99' | '100-299' | '300-499' | '500+';
  status?: string;
}

export abstract class TransactionRepository {
  abstract findAll(page: number, limit: number, filter?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }>;
  abstract findById(id: string): Promise<Transaction | null>;
  abstract save(transaction: Transaction): Promise<void>;
}
