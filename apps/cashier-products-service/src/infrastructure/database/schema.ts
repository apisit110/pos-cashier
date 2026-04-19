import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  barcode: text('barcode').notNull().unique(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  imageUrl: text('image_url'),
  unitName: text('unit_name'),
  brand: text('brand'),
});

export const syncMetadata = sqliteTable('sync_metadata', {
  id: text('id').primaryKey(), // Using a fixed ID like 'latest' or 'default'
  lastProductSyncVersion: text('last_product_sync_version'),
  status: text('status').$type<'IDLE' | 'SYNCING' | 'ERROR' | 'SUCCESS'>().notNull().default('IDLE'),
  updatedAt: text('updated_at').notNull(),
});
