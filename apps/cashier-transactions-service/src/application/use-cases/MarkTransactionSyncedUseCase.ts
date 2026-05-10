import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';

@Injectable()
export class MarkTransactionSyncedUseCase {
  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(transactionId: string) {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    transaction.isSynced = true;
    await this.transactionRepository.update(transaction);
    return { success: true };
  }
}
