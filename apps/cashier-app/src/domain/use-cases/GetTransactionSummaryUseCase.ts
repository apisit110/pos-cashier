import type { TransactionRepository, TransactionSummaryFilter } from '../../domain/repositories/TransactionRepository';

export class GetTransactionSummaryUseCase {
  private transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(filter: TransactionSummaryFilter) {
    return this.transactionRepository.getSummary(filter);
  }
}
