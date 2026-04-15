import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  barcode: text('barcode').notNull().unique(),
  name: text('name').notNull(),
  price: real('price').notNull(),
});
