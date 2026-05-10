import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class GetTransactionByIdUseCase {
  private transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(id: string) {
    return this.transactionRepository.getTransactionById(id);
  }
}
