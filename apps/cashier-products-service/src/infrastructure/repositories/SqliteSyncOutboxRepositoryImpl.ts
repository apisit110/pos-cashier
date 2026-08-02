import { randomUUID } from 'crypto';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq, and, lt } from 'drizzle-orm';
import { Product } from '../../domain/entities/Product';
import { SyncOutboxEntry } from '../../domain/entities/SyncOutboxEntry';
import { ISyncOutboxRepository } from '../../domain/repositories/ISyncOutboxRepository';
import { schema } from '@lightning-pos/model';

const MAX_RETRIES = 5;

export class SqliteSyncOutboxRepositoryImpl implements ISyncOutboxRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async enqueue(product: Product): Promise<void> {
    await this.db.insert(schema.syncOutbox).values({
      id: randomUUID(),
      productId: product.id,
      payload: JSON.stringify(product),
      status: 'PENDING',
      retryCount: 0,
      createdAt: new Date().toISOString(),
    });
  }

  async getPending(): Promise<SyncOutboxEntry[]> {
    const rows = await this.db
      .select()
      .from(schema.syncOutbox)
      .where(and(eq(schema.syncOutbox.status, 'PENDING'), lt(schema.syncOutbox.retryCount, MAX_RETRIES)))
      .orderBy(schema.syncOutbox.createdAt);

    return rows.map((row) => {
      const raw = JSON.parse(row.payload);
      const product = new Product(raw.id, raw.barcode, raw.name, raw.price, raw.imageUrl, raw.unitName, raw.brand);
      return new SyncOutboxEntry(row.id, product, row.retryCount);
    });
  }

  async markDone(id: string): Promise<void> {
    await this.db
      .update(schema.syncOutbox)
      .set({ status: 'DONE', processedAt: new Date().toISOString() })
      .where(eq(schema.syncOutbox.id, id));
  }

  async markFailed(id: string): Promise<void> {
    const row = await this.db
      .select({ retryCount: schema.syncOutbox.retryCount })
      .from(schema.syncOutbox)
      .where(eq(schema.syncOutbox.id, id))
      .limit(1);

    if (!row.length) return;

    const nextRetryCount = row[0].retryCount + 1;
    await this.db
      .update(schema.syncOutbox)
      .set({
        retryCount: nextRetryCount,
        status: nextRetryCount >= MAX_RETRIES ? 'FAILED' : 'PENDING',
      })
      .where(eq(schema.syncOutbox.id, id));
  }
}
