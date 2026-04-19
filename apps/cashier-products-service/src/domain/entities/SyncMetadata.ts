export type SyncStatus = 'IDLE' | 'SYNCING' | 'ERROR' | 'SUCCESS';

export class SyncMetadata {
  constructor(
    public readonly id: string,
    public readonly lastProductSyncVersion: string | null,
    public readonly status: SyncStatus,
    public readonly updatedAt: string,
  ) {}
}
