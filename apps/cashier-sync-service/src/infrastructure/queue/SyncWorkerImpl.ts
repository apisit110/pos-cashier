import { Worker, Job } from 'bullmq';
import { SyncOrderUseCase } from '../../application/usecases/SyncOrderUseCase';
import { SyncTransactionUseCase } from '../../application/usecases/SyncTransactionUseCase';
import { SyncProductsUseCase } from '../../application/usecases/SyncProductsUseCase';
import { SYNC_JOBS, SYNC_QUEUE_NAME } from './sync-queue.constants';

export function createSyncWorker(
  syncOrderUseCase: SyncOrderUseCase,
  syncTransactionUseCase: SyncTransactionUseCase,
  syncProductsUseCase: SyncProductsUseCase,
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
        case SYNC_JOBS.SYNC_PRODUCTS:
          // return value is read back by cashier-products-service via job.waitUntilFinished
          return syncProductsUseCase.execute();
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
