import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq, or } from 'drizzle-orm';
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

  async findByUserId(userId: string): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: eq(schema.users.userId, userId),
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

  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const results = await this.db.query.users.findMany({
      limit,
      offset,
      orderBy: (users, { desc }) => [desc(users.updatedAt)],
    });

    const allUsers = this.db.select().from(schema.users).all();
    const totalCount = allUsers.length;

    return {
      users: results.map(r => this.mapToEntity(r)),
      total: totalCount,
    };
  }

  async create(userData: { userId: string; fullName: string; roleId: number; pinHash: string; status: string }): Promise<User> {
    const [result] = await this.db.insert(schema.users).values({
      userId: userData.userId,
      fullName: userData.fullName,
      roleId: userData.roleId,
      pinHash: userData.pinHash,
      status: userData.status as any,
      updatedAt: new Date(),
    }).returning();

    return this.mapToEntity(result);
  }

  async findAllToSync(): Promise<User[]> {
    const results = await this.db.query.users.findMany({
      where: or(
        eq(schema.users.status, 'pending_sync'),
        eq(schema.users.status, 'active')
      ),
    });

    return results.map(r => this.mapToEntity(r));
  }

  async updateSyncId(id: number, syncId: string): Promise<void> {
    await this.db.update(schema.users)
      .set({ syncId })
      .where(eq(schema.users.id, id));
  }

  private mapToEntity(result: any): User {
    return new User(
      result.id,
      result.userId,
      result.roleId,
      result.fullName,
      result.pinHash,
      result.status as UserStatus,
      result.syncId,
      result.updatedAt,
    );
  }
}
