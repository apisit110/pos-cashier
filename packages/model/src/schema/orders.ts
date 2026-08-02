import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { orderItems } from './orderItems';

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  merchantId: text('merchant_id').notNull(),
  storeId: text('store_id').notNull(),
  terminalId: text('terminal_id'),
  totalAmount: real('total_amount').notNull(),
  staffId: text('staff_id').notNull(),
  memberId: text('member_id'),
  status: text('status', { enum: ['PENDING', 'PAID', 'CANCELLED'] }).notNull().default('PENDING'),
  isSynced: integer('is_synced', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  idempotencyKey: text('idempotency_key').unique(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));
