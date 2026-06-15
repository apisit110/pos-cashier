import { Product } from '../entities/Product';
import { SyncOutboxEntry } from '../entities/SyncOutboxEntry';

export interface ISyncOutboxRepository {
  enqueue(product: Product): Promise<void>;
  getPending(): Promise<SyncOutboxEntry[]>;
  markDone(id: string): Promise<void>;
  markFailed(id: string): Promise<void>;
}
