import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { SyncMetadata, SyncStatus } from '../../domain/entities/SyncMetadata';
import { ISyncMetadataRepository } from '../../domain/repositories/ISyncMetadataRepository';
import { schema } from '@lightning-pos/model';

export class SqliteSyncMetadataRepositoryImpl implements ISyncMetadataRepository {
  private readonly DEFAULT_ID = 'default';

  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async getLatest(): Promise<SyncMetadata | null> {
    const result = await this.db.query.syncMetadata.findFirst({
      where: eq(schema.syncMetadata.id, this.DEFAULT_ID),
    });

    if (!result) return null;

    return new SyncMetadata(
      result.id,
      result.lastProductSyncVersion,
      result.status as SyncStatus,
      result.updatedAt,
    );
  }

  async upsert(metadata: Partial<SyncMetadata>): Promise<void> {
    const existing = await this.getLatest();
    const now = new Date().toISOString();

    if (existing) {
      await this.db
        .update(schema.syncMetadata)
        .set({
          lastProductSyncVersion: metadata.lastProductSyncVersion ?? existing.lastProductSyncVersion,
          status: metadata.status ?? existing.status,
          updatedAt: now,
        })
        .where(eq(schema.syncMetadata.id, this.DEFAULT_ID));
    } else {
      await this.db.insert(schema.syncMetadata).values({
        id: this.DEFAULT_ID,
        lastProductSyncVersion: metadata.lastProductSyncVersion ?? 0,
        status: metadata.status ?? 'IDLE',
        updatedAt: now,
      });
    }
  }

  async updateStatus(status: SyncStatus): Promise<void> {
    await this.upsert({ status });
  }
}
