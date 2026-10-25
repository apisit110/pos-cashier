import { Queue, QueueEvents } from 'bullmq';
import { ISyncQueueService } from '../../domain/repositories/ISyncQueueService';
import { SYNC_JOBS, SYNC_PULL_JOB_OPTIONS, SYNC_QUEUE_NAME } from './sync-queue.constants';

const SYNC_STAFFS_TIMEOUT_MS = parseInt(process.env.SYNC_STAFFS_TIMEOUT_MS ?? '60000');

export class SyncQueueServiceImpl implements ISyncQueueService {
  private readonly syncQueue: Queue;
  private readonly syncQueueEvents: QueueEvents;

  constructor() {
    const connection = {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
    };
    this.syncQueue = new Queue(SYNC_QUEUE_NAME, { connection });
    this.syncQueueEvents = new QueueEvents(SYNC_QUEUE_NAME, { connection });
  }

  async addSyncPullJob(): Promise<void> {
    // no syncState: the job reads pull state itself
    await this.syncQueue.add(SYNC_JOBS.SYNC_PULL, { syncState: null }, SYNC_PULL_JOB_OPTIONS);
  }

  // the pull itself runs in cashier-sync-service; wait for its result so the API stays synchronous
  async syncStaffs(): Promise<{ success: boolean; results: { userId: string; status: string }[] }> {
    const job = await this.syncQueue.add(SYNC_JOBS.SYNC_STAFFS, {}, { removeOnComplete: true, removeOnFail: true });
    try {
      return await job.waitUntilFinished(this.syncQueueEvents, SYNC_STAFFS_TIMEOUT_MS);
    } catch (error) {
      console.error('[SyncQueueServiceImpl] sync-staffs job did not finish:', (error as Error).message);
      await job.remove().catch(() => undefined);
      return { success: false, results: [] };
    }
  }
}
