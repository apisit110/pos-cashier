import { Inject, Injectable, Logger } from '@nestjs/common';
import type { TransactionSyncRepository } from '../interfaces/TransactionSyncRepository';
import type { TransactionRepository } from '../interfaces/TransactionRepository';

@Injectable()
export class SyncTransactionUseCase {
  private readonly logger = new Logger(SyncTransactionUseCase.name);

  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject('TransactionSyncRepository')
    private readonly transactionSyncRepository: TransactionSyncRepository,
  ) {}

  async execute(transactionId: string): Promise<void> {
    this.logger.log(`Executing sync for transaction: ${transactionId}`);

    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      this.logger.error(`Transaction ${transactionId} not found`);
      return;
    }

    try {
      await this.transactionSyncRepository.syncTransaction(transaction);
      await this.transactionRepository.markAsSynced(transactionId);
      this.logger.log(`Transaction ${transactionId} synced successfully.`);
    } catch (error: any) {
      this.logger.error(`Failed to sync transaction ${transactionId}: ${error.message}`);
      throw error;
    }
  }
}
