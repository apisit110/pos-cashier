import { SyncState } from '../entities/SyncState';

export interface ISyncQueueService {
  /** queues one sync-pull, jobs added while one is waiting or running are merged */
  addSyncPullJob(syncState: SyncState | null): Promise<void>;
}
