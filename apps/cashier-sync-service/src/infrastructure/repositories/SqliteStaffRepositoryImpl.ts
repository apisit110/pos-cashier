import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { schema, SYNC_STATUS } from '@lightning-pos/model';
import { IStaffRepository } from '../../domain/repositories/IStaffRepository';

export class SqliteStaffRepositoryImpl implements IStaffRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async upsertWithPin(staff: Parameters<IStaffRepository['upsertWithPin']>[0]): Promise<void> {
    const now = new Date();
    const values = {
      fullName: staff.fullName,
      roleId: staff.roleId,
      status: staff.status,
      syncStatus: SYNC_STATUS.SYNCED,
      syncId: staff.syncId,
      updatedAt: now,
    };

    this.db.transaction((tx) => {
      const [saved] = tx
        .insert(schema.staffs)
        .values({ username: staff.username, ...values })
        .onConflictDoUpdate({ target: schema.staffs.username, set: values })
        .returning({ id: schema.staffs.id })
        .all();

      if (staff.pinHash) {
        tx.insert(schema.staffPins)
          .values({ userId: saved.id, pinHash: staff.pinHash, createdAt: now, updatedAt: now })
          .onConflictDoUpdate({
            target: schema.staffPins.userId,
            set: { pinHash: staff.pinHash, updatedAt: now },
          })
          .run();
      }
    });
  }
}
