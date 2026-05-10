import type { TransactionRepository, TransactionFilter } from '../../domain/repositories/TransactionRepository';

export class GetTransactionsUseCase {
  private transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(page: number, limit: number, filter?: TransactionFilter) {
    return this.transactionRepository.getTransactions(page, limit, filter);
  }
}
