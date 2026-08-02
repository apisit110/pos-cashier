import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const roles = sqliteTable('roles', {
  id: integer('id').primaryKey(),
  roleName: text('role_name').notNull(), // manager, cashier
});
