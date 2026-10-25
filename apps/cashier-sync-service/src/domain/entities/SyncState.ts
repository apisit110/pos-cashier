import { SyncMetadata } from './SyncMetadata';

/** current versions of pos-center, from pull state or `syncState` of a push response */
export class SyncState {
  constructor(
    public readonly productVersion: number,
    public readonly profileVersion: string,
  ) {}

  /** products of the store changed after the last pulled `syncVersion` */
  hasNewProducts(metadata: SyncMetadata | null): boolean {
    return this.productVersion > (metadata?.lastProductSyncVersion ?? 0);
  }

  /** cashier profile changed after the last pull cashier-profile */
  hasNewProfile(metadata: SyncMetadata | null): boolean {
    return this.profileVersion !== (metadata?.profileVersion ?? null);
  }
}
