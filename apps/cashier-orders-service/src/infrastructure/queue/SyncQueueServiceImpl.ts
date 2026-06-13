import { Queue } from 'bullmq';
import { ISyncQueueService } from '../../domain/repositories/ISyncQueueService';
import { SYNC_JOBS, SYNC_QUEUE_NAME } from './sync-queue.constants';

const JOB_OPTIONS = {
  attempts: 5,
  backoff: { type: 'exponential', delay: 5000 },
};

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

  async addOrderSyncJob(orderId: string): Promise<void> {
    await this.syncQueue.add(SYNC_JOBS.SYNC_ORDER, { orderId }, JOB_OPTIONS);
  }

  async addTransactionSyncJob(transactionId: string): Promise<void> {
    await this.syncQueue.add(SYNC_JOBS.SYNC_TRANSACTION, { transactionId }, JOB_OPTIONS);
  }
}
