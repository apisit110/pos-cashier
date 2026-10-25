import { Queue, QueueEvents } from 'bullmq';
import { ISyncQueueService } from '../../domain/repositories/ISyncQueueService';
import { SYNC_JOBS, SYNC_QUEUE_NAME } from './sync-queue.constants';

const SYNC_PRODUCTS_TIMEOUT_MS = parseInt(process.env.SYNC_PRODUCTS_TIMEOUT_MS ?? '60000');

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

  // the pull itself runs in cashier-sync-service; wait for its result so the API stays synchronous
  async syncProducts(): Promise<{ success: boolean; count: number }> {
    const job = await this.syncQueue.add(SYNC_JOBS.SYNC_PRODUCTS, {}, { removeOnComplete: true, removeOnFail: true });
    try {
      return await job.waitUntilFinished(this.syncQueueEvents, SYNC_PRODUCTS_TIMEOUT_MS);
    } catch (error) {
      console.error('[SyncQueueServiceImpl] sync-products job did not finish:', (error as Error).message);
      await job.remove().catch(() => undefined);
      return { success: false, count: 0 };
    }
  }
}
