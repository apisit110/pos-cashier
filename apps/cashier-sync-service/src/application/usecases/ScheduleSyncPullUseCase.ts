import { SyncState } from '../../domain/entities/SyncState';
import { ISyncMetadataRepository } from '../../domain/repositories/ISyncMetadataRepository';
import { ISyncQueueService } from '../../domain/repositories/ISyncQueueService';

export class ScheduleSyncPullUseCase {
  constructor(
    private readonly syncMetadataRepository: ISyncMetadataRepository,
    private readonly syncQueueService: ISyncQueueService,
  ) {}

  /**
   * After a push: queues sync-pull only when `syncState` is newer than the local data (checked locally, no request).
   * Without `syncState` (old pos-center or its lookup failed) the queued sync-pull reads pull state itself.
   */
  async execute(syncState: SyncState | null): Promise<void> {
    if (syncState) {
      const metadata = await this.syncMetadataRepository.getLatest();
      if (!syncState.hasNewProducts(metadata) && !syncState.hasNewProfile(metadata)) return;
    }

    await this.syncQueueService.addSyncPullJob(syncState);
  }
}
