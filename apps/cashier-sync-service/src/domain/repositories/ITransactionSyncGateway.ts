export interface ITransactionSyncGateway {
  syncTransaction(transaction: any): Promise<void>;
}
