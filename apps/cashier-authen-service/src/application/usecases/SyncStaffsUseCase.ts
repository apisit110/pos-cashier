import { ISyncQueueService } from '../../domain/repositories/ISyncQueueService';

export class SyncStaffsUseCase {
  constructor(
    private readonly syncQueueService: ISyncQueueService,
    private readonly appMode: 'online' | 'offline' = 'online',
  ) {}

  /**
   * Pulls the staffs of the merchant from pos-center (cashier profile) in cashier-sync-service,
   * which upserts them with their pin hash by username
   */
  async execute(): Promise<{ success: boolean; results: { userId: string; status: string }[] }> {
    // cashier-sync-service runs no worker in offline mode, so the job would never be picked up
    if (this.appMode === 'offline') {
      throw new Error('Sync staffs is not available in offline mode');
    }

    const result = await this.syncQueueService.syncStaffs();
    if (!result.success) {
      throw new Error('Sync staffs failed');
    }
    return result;
  }
}
