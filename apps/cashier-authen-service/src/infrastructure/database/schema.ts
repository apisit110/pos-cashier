import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const roles = sqliteTable('roles', {
  id: integer('id').primaryKey(),
  roleName: text('role_name').notNull(), // manager, cashier
});

export const staffs = sqliteTable('staffs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  roleId: integer('role_id').notNull().references(() => roles.id),
  fullName: text('full_name').notNull(),
  pinHash: text('pin_hash').notNull(),
  status: text('status', { enum: ['active', 'pending_sync', 'inactive'] }).notNull(),
  syncId: text('sync_id'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const rolePermissions = sqliteTable('role_permissions', {
  roleId: integer('role_id').notNull().references(() => roles.id),
  permissionKey: text('permission_key').notNull(),
  isGranted: integer('is_granted', { mode: 'boolean' }).notNull(),
});
