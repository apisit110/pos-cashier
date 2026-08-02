import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull(),
  amount: real('amount').notNull(),
  method: text('method', { enum: ['CASH', 'CREDIT_CARD', 'QR_CODE'] }).notNull(),
  status: text('status', { enum: ['SUCCESS', 'FAILED', 'PENDING'] }).notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  receivedAmount: real('received_amount'),
  changeAmount: real('change_amount'),
});
