import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const syncMetadata = sqliteTable('sync_metadata', {
  id: text('id').primaryKey(),
  lastProductSyncVersion: integer('last_product_sync_version').notNull().default(0),
  status: text('status').$type<'IDLE' | 'SYNCING' | 'ERROR' | 'SUCCESS'>().notNull().default('IDLE'),
  updatedAt: text('updated_at').notNull(),
});
