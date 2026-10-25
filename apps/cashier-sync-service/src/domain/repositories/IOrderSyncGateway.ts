import { SyncState } from '../entities/SyncState';

export interface IOrderSyncGateway {
  /** returns `syncState` of the response, null when missing */
  syncOrder(order: any): Promise<SyncState | null>;
}
