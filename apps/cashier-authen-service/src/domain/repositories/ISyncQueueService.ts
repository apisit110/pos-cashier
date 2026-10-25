export interface ISyncQueueService {
  /** queues sync-pull (pull products / cashier profile when changed in pos-center), does not wait */
  addSyncPullJob(): Promise<void>;
  /** pulls the cashier profile in cashier-sync-service and waits for the result */
  syncStaffs(): Promise<{ success: boolean; results: { userId: string; status: string }[] }>;
}
