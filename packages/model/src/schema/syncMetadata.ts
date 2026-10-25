import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const syncMetadata = sqliteTable('sync_metadata', {
  id: text('id').primaryKey(),
  lastProductSyncVersion: integer('last_product_sync_version').notNull().default(0),
  // profile_version of the last pull cashier-profile, null = never pulled
  profileVersion: text('profile_version'),
  status: text('status').$type<'IDLE' | 'SYNCING' | 'ERROR' | 'SUCCESS'>().notNull().default('IDLE'),
  updatedAt: text('updated_at').notNull(),
});
