export interface ISyncQueueService {
  syncProducts(): Promise<{ success: boolean; count: number }>;
}
