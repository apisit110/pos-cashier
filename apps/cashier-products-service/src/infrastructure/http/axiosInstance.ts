import { AxiosInstance } from 'axios';
import { createSyncClient, syncConfigFromEnv } from '@lightning-pos/sync-client';

let httpClient: AxiosInstance | null = null;

// created on first use so offline mode does not need the pos-sync-service credential
export function getHttpClient(): AxiosInstance {
  httpClient ??= createSyncClient(syncConfigFromEnv());
  return httpClient;
}
