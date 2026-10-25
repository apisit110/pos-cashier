import { SyncState } from '../entities/SyncState';

export interface ISyncStateGateway {
  fetchSyncState(): Promise<SyncState>;
}
