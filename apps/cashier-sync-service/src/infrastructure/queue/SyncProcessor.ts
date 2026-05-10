import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SyncOrderUseCase } from '../../application/use-cases/SyncOrderUseCase';
import { SyncTransactionUseCase } from '../../application/use-cases/SyncTransactionUseCase';

import { SYNC_JOBS, SYNC_QUEUE_NAME } from './sync-queue.constants';

@Processor(SYNC_QUEUE_NAME)
export class SyncProcessor extends WorkerHost {
  constructor(
    private readonly syncOrderUseCase: SyncOrderUseCase,
    private readonly syncTransactionUseCase: SyncTransactionUseCase,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case SYNC_JOBS.SYNC_ORDER:
        await this.syncOrderUseCase.execute(job.data.orderId);
        break;
      case SYNC_JOBS.SYNC_TRANSACTION:
        await this.syncTransactionUseCase.execute(job.data.transactionId);
        break;
      default:
        console.warn(`Unknown job name: ${job.name}`);
    }
  }
}
