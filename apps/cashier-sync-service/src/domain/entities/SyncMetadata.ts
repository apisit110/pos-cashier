export type SyncStatus = 'IDLE' | 'SYNCING' | 'ERROR' | 'SUCCESS';

export class SyncMetadata {
  constructor(
    public readonly id: string,
    public readonly lastProductSyncVersion: number,
    public readonly status: SyncStatus,
    public readonly updatedAt: string,
    /** profile_version of the last pull cashier-profile, null = never pulled */
    public readonly profileVersion: string | null = null,
  ) {}
}
