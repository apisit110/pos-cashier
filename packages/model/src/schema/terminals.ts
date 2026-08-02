import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const terminals = sqliteTable('terminals', {
  tid: text('tid').primaryKey(),
  mid: text('mid').notNull(),
  sid: text('sid').notNull(),
  isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
});
