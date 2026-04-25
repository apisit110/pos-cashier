import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class GetTransactionsUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(page: number, limit: number) {
    return this.transactionRepository.getTransactions(page, limit);
  }
}
