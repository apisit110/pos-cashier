import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { roles } from './roles';

export const staffs = sqliteTable('staffs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  roleId: integer('role_id').notNull().references(() => roles.id),
  fullName: text('full_name').notNull(),
  status: text('status', { enum: ['active', 'inactive'] }).notNull(),
  syncStatus: text('sync_status', { enum: ['pending', 'synced', 'error'] }).notNull().default('pending'),
  syncId: text('sync_id'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
