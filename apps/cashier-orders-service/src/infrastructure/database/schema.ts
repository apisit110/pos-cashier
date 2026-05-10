import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

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
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
