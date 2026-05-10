export interface TransactionSyncRepository {
  syncTransaction(transaction: any): Promise<void>;
}
