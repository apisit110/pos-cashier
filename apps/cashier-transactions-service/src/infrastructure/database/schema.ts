import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().unique(),
  amount: real('amount').notNull(),
  paymentMethod: text('payment_method').notNull(), // cash, credit_card, qr_promptpay
  status: text('status').notNull(), // success, failed, refunded
  staffName: text('staff_name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
