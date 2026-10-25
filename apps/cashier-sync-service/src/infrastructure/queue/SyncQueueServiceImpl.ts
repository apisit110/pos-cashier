import { Queue } from 'bullmq';
import { SyncState } from '../../domain/entities/SyncState';
import { ISyncQueueService } from '../../domain/repositories/ISyncQueueService';
import { SYNC_JOBS, SYNC_PULL_JOB_OPTIONS, SYNC_QUEUE_NAME } from './sync-queue.constants';

export class SyncQueueServiceImpl implements ISyncQueueService {
  private readonly syncQueue: Queue;

  constructor() {
    this.syncQueue = new Queue(SYNC_QUEUE_NAME, {
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    });
  }

  async addSyncPullJob(syncState: SyncState | null): Promise<void> {
    await this.syncQueue.add(SYNC_JOBS.SYNC_PULL, { syncState }, SYNC_PULL_JOB_OPTIONS);
  }

  async close(): Promise<void> {
    await this.syncQueue.close();
  }
}
