import { ITransactionRepository } from '../repositories/ITransactionRepository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class GetTransactionByIdUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(id: string) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundError(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
