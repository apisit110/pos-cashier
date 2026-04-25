import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { RolePermission } from '../../domain/entities/RolePermission';
import { PermissionRepository } from '../../domain/repositories/PermissionRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqlitePermissionRepository implements PermissionRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findByRoleId(roleId: number): Promise<RolePermission[]> {
    const results = await this.db.query.rolePermissions.findMany({
      where: eq(schema.rolePermissions.roleId, roleId),
    });

    return results.map(p => new RolePermission(p.roleId, p.permissionKey, p.isGranted));
  }
}
