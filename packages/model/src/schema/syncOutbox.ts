import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const syncOutbox = sqliteTable('sync_outbox', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  payload: text('payload').notNull(),
  status: text('status').$type<'PENDING' | 'DONE' | 'FAILED'>().notNull().default('PENDING'),
  retryCount: integer('retry_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  processedAt: text('processed_at'),
});
