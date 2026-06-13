import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Staff, StaffStatus } from '../../domain/entities/Staff';
import { IStaffRepository } from '../../domain/repositories/IStaffRepository';
import * as schema from '../database/schema';

export class SqliteStaffRepositoryImpl implements IStaffRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async findByUsername(username: string): Promise<Staff | null> {
    const result = await this.db.query.staffs.findFirst({
      where: eq(schema.staffs.username, username),
    });
    if (!result) return null;
    return this.mapToEntity(result);
  }

  async findById(id: number): Promise<Staff | null> {
    const result = await this.db.query.staffs.findFirst({
      where: eq(schema.staffs.id, id),
    });
    if (!result) return null;
    return this.mapToEntity(result);
  }

  async findAll(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }> {
    const offset = (page - 1) * limit;

    const results = await this.db.query.staffs.findMany({
      limit,
      offset,
      orderBy: (staffs, { desc }) => [desc(staffs.updatedAt)],
    });

    const allStaffs = this.db.select().from(schema.staffs).all();

    return {
      staffs: results.map((r) => this.mapToEntity(r)),
      total: allStaffs.length,
    };
  }

  async create(staffData: {
    username: string;
    fullName: string;
    roleId: number;
    pinHash: string;
    status: string;
  }): Promise<Staff> {
    const [result] = await this.db
      .insert(schema.staffs)
      .values({
        username: staffData.username,
        fullName: staffData.fullName,
        roleId: staffData.roleId,
        pinHash: staffData.pinHash,
        status: staffData.status as any,
        updatedAt: new Date(),
      })
      .returning();

    return this.mapToEntity(result);
  }

  async findAllToSync(): Promise<Staff[]> {
    const results = await this.db.query.staffs.findMany({
      where: eq(schema.staffs.status, StaffStatus.PENDING_SYNC as any),
    });
    return results.map((r) => this.mapToEntity(r));
  }

  async updateSyncStatus(id: number, username: string, status: string): Promise<void> {
    await this.db
      .update(schema.staffs)
      .set({ username, status: status as any, updatedAt: new Date() })
      .where(eq(schema.staffs.id, id));
  }

  async countAll(): Promise<number> {
    const results = this.db.select().from(schema.staffs).all();
    return results.length;
  }

  private mapToEntity(result: any): Staff {
    return new Staff(
      result.id,
      result.username,
      result.roleId,
      result.fullName,
      result.pinHash,
      result.status as StaffStatus,
      result.syncId,
      result.updatedAt,
    );
  }
}
