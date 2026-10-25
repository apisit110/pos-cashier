import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { ITransactionSyncGateway } from '../../domain/repositories/ITransactionSyncGateway';
import { SyncState } from '../../domain/entities/SyncState';

export class SyncTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionSyncGateway: ITransactionSyncGateway,
  ) {}

  /** returns `syncState` of the push, null when missing or the transaction is not found */
  async execute(transactionId: string): Promise<SyncState | null> {
    console.log(`Executing sync for transaction: ${transactionId}`);

    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      console.error(`Transaction ${transactionId} not found`);
      return null;
    }

    try {
      const syncState = await this.transactionSyncGateway.syncTransaction(transaction);
      await this.transactionRepository.markAsSynced(transactionId);
      console.log(`Transaction ${transactionId} synced successfully.`);
      return syncState;
    } catch (error: any) {
      console.error(`Failed to sync transaction ${transactionId}: ${error.message}`);
      throw error;
    }
  }
}
