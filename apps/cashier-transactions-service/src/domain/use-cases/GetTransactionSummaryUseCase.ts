import { ITransactionRepository, TransactionSummaryFilter } from '../repositories/ITransactionRepository';

export class GetTransactionSummaryUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(filter: TransactionSummaryFilter) {
    return this.transactionRepository.getSummary(filter);
  }
}
