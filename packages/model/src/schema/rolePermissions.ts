import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { roles } from './roles';

export const rolePermissions = sqliteTable('role_permissions', {
  roleId: integer('role_id').notNull().references(() => roles.id),
  permissionKey: text('permission_key').notNull(),
  isGranted: integer('is_granted', { mode: 'boolean' }).notNull(),
});
