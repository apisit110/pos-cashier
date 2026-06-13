import { ITransactionRepository } from '../repositories/ITransactionRepository';
import { ITransactionSyncGateway } from '../ports/ITransactionSyncGateway';

export class SyncTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionSyncGateway: ITransactionSyncGateway,
  ) {}

  async execute(transactionId: string): Promise<void> {
    console.log(`Executing sync for transaction: ${transactionId}`);

    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      console.error(`Transaction ${transactionId} not found`);
      return;
    }

    try {
      await this.transactionSyncGateway.syncTransaction(transaction);
      await this.transactionRepository.markAsSynced(transactionId);
      console.log(`Transaction ${transactionId} synced successfully.`);
    } catch (error: any) {
      console.error(`Failed to sync transaction ${transactionId}: ${error.message}`);
      throw error;
    }
  }
}
