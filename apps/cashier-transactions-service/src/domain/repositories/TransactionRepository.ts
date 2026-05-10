import { Transaction } from '../entities/Transaction';

export abstract class TransactionRepository {
  abstract findAll(page: number, limit: number): Promise<{ transactions: Transaction[]; total: number }>;
  abstract findById(id: number): Promise<Transaction | null>;
  abstract save(transaction: Transaction): Promise<void>;
}
