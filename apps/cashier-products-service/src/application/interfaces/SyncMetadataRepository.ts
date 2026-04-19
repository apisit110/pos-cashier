import { SyncMetadata, SyncStatus } from '../../domain/entities/SyncMetadata';

export interface SyncMetadataRepository {
  getLatest(): Promise<SyncMetadata | null>;
  upsert(metadata: Partial<SyncMetadata>): Promise<void>;
  updateStatus(status: SyncStatus): Promise<void>;
}
