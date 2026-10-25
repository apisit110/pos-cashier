import { SyncState } from '../entities/SyncState';

export interface ITransactionSyncGateway {
  /** returns `syncState` of the response, null when missing */
  syncTransaction(transaction: any): Promise<SyncState | null>;
}
