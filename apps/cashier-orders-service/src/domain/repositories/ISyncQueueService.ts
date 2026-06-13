export interface ISyncQueueService {
  addOrderSyncJob(orderId: string): Promise<void>;
  addTransactionSyncJob(transactionId: string): Promise<void>;
}
