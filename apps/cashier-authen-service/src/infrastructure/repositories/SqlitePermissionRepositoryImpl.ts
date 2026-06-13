import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { RolePermission } from '../../domain/entities/RolePermission';
import { IPermissionRepository } from '../../domain/repositories/IPermissionRepository';
import * as schema from '../database/schema';

export class SqlitePermissionRepositoryImpl implements IPermissionRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async findByRoleId(roleId: number): Promise<RolePermission[]> {
    const results = await this.db.query.rolePermissions.findMany({
      where: eq(schema.rolePermissions.roleId, roleId),
    });
    return results.map((p) => new RolePermission(p.roleId, p.permissionKey, p.isGranted));
  }
}
