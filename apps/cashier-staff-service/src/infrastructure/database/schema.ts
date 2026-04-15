import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const staff = sqliteTable('staff', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'cashier'] }).notNull(),
});
