import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { User, UserStatus } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteUserRepository implements UserRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findByStaffId(staffId: string): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: eq(schema.users.staffId, staffId),
    });

    if (!result) {
      return null;
    }

    return this.mapToEntity(result);
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    if (!result) {
      return null;
    }

    return this.mapToEntity(result);
  }

  private mapToEntity(result: any): User {
    return new User(
      result.id,
      result.staffId,
      result.roleId,
      result.fullName,
      result.pinHash,
      result.status as UserStatus,
      result.updatedAt,
    );
  }
}
