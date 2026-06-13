import { Worker, Job } from 'bullmq';
import { SyncOrderUseCase } from '../../domain/use-cases/SyncOrderUseCase';
import { SyncTransactionUseCase } from '../../domain/use-cases/SyncTransactionUseCase';
import { SYNC_JOBS, SYNC_QUEUE_NAME } from './sync-queue.constants';

export function createSyncWorker(
  syncOrderUseCase: SyncOrderUseCase,
  syncTransactionUseCase: SyncTransactionUseCase,
): Worker {
  const worker = new Worker(
    SYNC_QUEUE_NAME,
    async (job: Job) => {
      switch (job.name) {
        case SYNC_JOBS.SYNC_ORDER:
          await syncOrderUseCase.execute(job.data.orderId);
          break;
        case SYNC_JOBS.SYNC_TRANSACTION:
          await syncTransactionUseCase.execute(job.data.transactionId);
          break;
        default:
          console.warn(`Unknown job name: ${job.name}`);
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    },
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} (${job.name}) completed.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
  });

  return worker;
}
