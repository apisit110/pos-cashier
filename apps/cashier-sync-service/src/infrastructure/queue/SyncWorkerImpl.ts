import { Worker, Job } from 'bullmq';
import { SyncOrderUseCase } from '../../application/usecases/SyncOrderUseCase';
import { SyncTransactionUseCase } from '../../application/usecases/SyncTransactionUseCase';
import { SyncProductsUseCase } from '../../application/usecases/SyncProductsUseCase';
import { SyncCashierProfileUseCase } from '../../application/usecases/SyncCashierProfileUseCase';
import { SyncPullUseCase } from '../../application/usecases/SyncPullUseCase';
import { ScheduleSyncPullUseCase } from '../../application/usecases/ScheduleSyncPullUseCase';
import { SyncState } from '../../domain/entities/SyncState';
import { SYNC_JOBS, SYNC_QUEUE_NAME } from './sync-queue.constants';

export function createSyncWorker(
  syncOrderUseCase: SyncOrderUseCase,
  syncTransactionUseCase: SyncTransactionUseCase,
  syncProductsUseCase: SyncProductsUseCase,
  syncCashierProfileUseCase: SyncCashierProfileUseCase,
  syncPullUseCase: SyncPullUseCase,
  scheduleSyncPullUseCase: ScheduleSyncPullUseCase,
): Worker {
  // a failed schedule must not fail (and retry) the push that is already saved
  const schedulePull = (syncState: SyncState | null) =>
    scheduleSyncPullUseCase.execute(syncState).catch((error) => {
      console.error('[SyncWorker] Failed to schedule sync-pull:', error);
    });

  const worker = new Worker(
    SYNC_QUEUE_NAME,
    async (job: Job) => {
      switch (job.name) {
        case SYNC_JOBS.SYNC_ORDER:
          await schedulePull(await syncOrderUseCase.execute(job.data.orderId));
          break;
        case SYNC_JOBS.SYNC_TRANSACTION:
          await schedulePull(await syncTransactionUseCase.execute(job.data.transactionId));
          break;
        case SYNC_JOBS.SYNC_PRODUCTS:
          // return value is read back by cashier-products-service via job.waitUntilFinished
          return syncProductsUseCase.execute();
        case SYNC_JOBS.SYNC_STAFFS:
          // return value is read back by cashier-authen-service via job.waitUntilFinished
          return syncCashierProfileUseCase.execute();
        case SYNC_JOBS.SYNC_PULL: {
          // job data is JSON, null = read pull state (login / push without syncState)
          const data = job.data.syncState;
          return syncPullUseCase.execute(data ? new SyncState(data.productVersion, data.profileVersion) : null);
        }
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
