import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Role, RoleName } from '../../domain/entities/Role';
import { RoleRepository } from '../../domain/repositories/RoleRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteRoleRepository implements RoleRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findById(id: number): Promise<Role | null> {
    const result = await this.db.query.roles.findFirst({
      where: eq(schema.roles.id, id),
    });

    if (!result) {
      return null;
    }

    return new Role(result.id, result.roleName as RoleName);
  }

  async findAll(): Promise<Role[]> {
    const results = await this.db.query.roles.findMany();
    return results.map(r => new Role(r.id, r.roleName as RoleName));
  }
}
