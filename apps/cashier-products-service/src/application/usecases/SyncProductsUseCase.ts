import { ISyncQueueService } from '../../domain/repositories/ISyncQueueService';

export class SyncProductsUseCase {
  constructor(
    private readonly syncQueueService: ISyncQueueService,
    private readonly appMode: 'online' | 'offline' = 'online',
  ) {}

  async execute(): Promise<{ success: boolean; count: number }> {
    // cashier-sync-service runs no worker in offline mode, so the job would never be picked up
    if (this.appMode === 'offline') {
      console.warn('[SyncProductsUseCase] Skipped: APP_MODE=offline');
      return { success: false, count: 0 };
    }

    return this.syncQueueService.syncProducts();
  }
}
