import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

import { SYNC_JOBS, SYNC_QUEUE_NAME } from './sync-queue.constants';

@Injectable()
export class SyncQueueService {
  constructor(
    @InjectQueue(SYNC_QUEUE_NAME) private readonly syncQueue: Queue,
  ) {}

  async addTransactionSyncJob(transactionId: string) {
    await this.syncQueue.add(SYNC_JOBS.SYNC_TRANSACTION, { transactionId }, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }
}
