import { Transaction } from '../entities/Transaction';

export abstract class TransactionRepository {
  abstract findAll(page: number, limit: number): Promise<{ transactions: Transaction[]; total: number }>;
  abstract save(transaction: Transaction): Promise<void>;
}
