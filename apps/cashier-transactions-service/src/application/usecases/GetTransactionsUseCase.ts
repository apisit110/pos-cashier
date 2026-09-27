import { ITransactionRepository, TransactionFilter } from '../../domain/repositories/ITransactionRepository';

export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(page: number, limit: number, filter?: TransactionFilter) {
    return this.transactionRepository.findAll(page, limit, filter);
  }
}
