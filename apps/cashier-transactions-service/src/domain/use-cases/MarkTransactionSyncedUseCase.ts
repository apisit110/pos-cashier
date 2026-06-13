import { ITransactionRepository } from '../repositories/ITransactionRepository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class MarkTransactionSyncedUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(transactionId: string) {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundError(`Transaction ${transactionId} not found`);
    }

    transaction.isSynced = true;
    await this.transactionRepository.update(transaction);
    return { success: true };
  }
}
