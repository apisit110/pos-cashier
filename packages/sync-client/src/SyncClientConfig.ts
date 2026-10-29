export interface SyncClientConfig {
  baseUrl: string;
  partnerId: string;
  clientId: string;
  clientSecret: string;
  tid: string;
  // sent as x-origin-secret, the Lambda Function URL rejects requests without it (unset for local pos-sync-service)
  originSecret?: string;
}

const REQUIRED_ENV = ['SYNC_PARTNER_ID', 'SYNC_CLIENT_ID', 'SYNC_CLIENT_SECRET', 'SYNC_TID'] as const;

/**
 * Reads the pos-sync-service credential from env (SYNC_SERVICE_URL, SYNC_PARTNER_ID, SYNC_CLIENT_ID, SYNC_CLIENT_SECRET, SYNC_TID,
 * optional SYNC_ORIGIN_SECRET)
 */
export function syncConfigFromEnv(): SyncClientConfig {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables for pos-sync-service: ${missing.join(', ')}`);
  }

  return {
    baseUrl: process.env.SYNC_SERVICE_URL ?? 'http://localhost:4002',
    partnerId: process.env.SYNC_PARTNER_ID!,
    clientId: process.env.SYNC_CLIENT_ID!,
    clientSecret: process.env.SYNC_CLIENT_SECRET!,
    tid: process.env.SYNC_TID!,
    originSecret: process.env.SYNC_ORIGIN_SECRET || undefined,
  };
}
