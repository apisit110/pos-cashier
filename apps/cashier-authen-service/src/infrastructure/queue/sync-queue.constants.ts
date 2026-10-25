import type { JobsOptions } from 'bullmq';

export const SYNC_QUEUE_NAME = 'sync-queue';

export const SYNC_JOBS = {
  SYNC_STAFFS: 'sync-staffs',
  SYNC_PULL: 'sync-pull',
} as const;

// wait a bit so a burst of sales / logins becomes one pull
const SYNC_PULL_DELAY_MS = parseInt(process.env.SYNC_PULL_DELAY_MS ?? '3000');

/** same options as cashier-sync-service: at most 1 waiting + 1 running sync-pull */
export const SYNC_PULL_JOB_OPTIONS: JobsOptions = {
  delay: SYNC_PULL_DELAY_MS,
  deduplication: { id: SYNC_JOBS.SYNC_PULL, replace: true, keepLastIfActive: true },
  removeOnComplete: true,
  removeOnFail: true,
};
