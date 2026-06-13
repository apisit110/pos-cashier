import { SyncMetadata, SyncStatus } from '../entities/SyncMetadata';

export interface ISyncMetadataRepository {
  getLatest(): Promise<SyncMetadata | null>;
  upsert(metadata: Partial<SyncMetadata>): Promise<void>;
  updateStatus(status: SyncStatus): Promise<void>;
}
