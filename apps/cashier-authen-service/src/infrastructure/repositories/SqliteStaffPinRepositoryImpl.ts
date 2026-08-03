import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { StaffPin } from '../../domain/entities/StaffPin';
import { IStaffPinRepository } from '../../domain/repositories/IStaffPinRepository';
import { schema } from '@lightning-pos/model';

export class SqliteStaffPinRepositoryImpl implements IStaffPinRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async findByUserId(userId: number): Promise<StaffPin | null> {
    const result = await this.db.query.staffPins.findFirst({
      where: eq(schema.staffPins.userId, userId),
    });
    if (!result) return null;
    return this.mapToEntity(result);
  }

  async create(data: { userId: number; pinHash: string }): Promise<StaffPin> {
    const now = new Date();
    const [result] = await this.db
      .insert(schema.staffPins)
      .values({
        userId: data.userId,
        pinHash: data.pinHash,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return this.mapToEntity(result);
  }

  private mapToEntity(result: any): StaffPin {
    return new StaffPin(
      result.id,
      result.userId,
      result.pinHash,
      result.failedAttempts,
      result.lockedUntil,
      result.createdAt,
      result.updatedAt,
    );
  }
}
