import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Staff, StaffStatus, StaffSyncStatus } from '../../domain/entities/Staff';
import { IStaffRepository } from '../../domain/repositories/IStaffRepository';
import { schema } from '@lightning-pos/model';

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
    status: string;
    syncStatus: string;
  }): Promise<Staff> {
    const [result] = await this.db
      .insert(schema.staffs)
      .values({
        username: staffData.username,
        fullName: staffData.fullName,
        roleId: staffData.roleId,
        status: staffData.status as any,
        syncStatus: staffData.syncStatus as any,
        updatedAt: new Date(),
      })
      .returning();

    return this.mapToEntity(result);
  }

  async findAllToSync(): Promise<Staff[]> {
    const results = await this.db.query.staffs.findMany({
      where: eq(schema.staffs.syncStatus, StaffSyncStatus.PENDING as any),
    });
    return results.map((r) => this.mapToEntity(r));
  }

  async updateSyncStatus(id: number, username: string, syncStatus: string): Promise<void> {
    await this.db
      .update(schema.staffs)
      .set({ username, syncStatus: syncStatus as any, updatedAt: new Date() })
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
      result.status as StaffStatus,
      result.syncStatus as StaffSyncStatus,
      result.syncId,
      result.updatedAt,
    );
  }
}
