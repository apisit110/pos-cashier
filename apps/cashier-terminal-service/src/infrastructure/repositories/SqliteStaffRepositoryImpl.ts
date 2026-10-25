import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { schema, ROLE_ID, STAFF_STATUS, SYNC_STATUS } from '@lightning-pos/model';
import { CenterStaff } from '../../domain/repositories/ITerminalCenterGateway';
import { IStaffRepository } from '../../domain/repositories/IStaffRepository';

export class SqliteStaffRepositoryImpl implements IStaffRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async upsertFromCenter(staffs: CenterStaff[]): Promise<void> {
    this.db.transaction((tx) => {
      for (const centerStaff of staffs) {
        const now = new Date();
        const values = {
          fullName: centerStaff.fullName || centerStaff.username,
          roleId: centerStaff.roles.some((role) => role.toLowerCase() === 'manager') ? ROLE_ID.MANAGER : ROLE_ID.CASHIER,
          status: centerStaff.status === 'ACTIVE' ? STAFF_STATUS.ACTIVE : STAFF_STATUS.INACTIVE,
          syncStatus: SYNC_STATUS.SYNCED,
          syncId: centerStaff.uid,
          updatedAt: now,
        };

        const [staff] = tx
          .insert(schema.staffs)
          .values({ username: centerStaff.username, ...values })
          .onConflictDoUpdate({ target: schema.staffs.username, set: values })
          .returning()
          .all();

        // pos-center gives an empty pin hash when the staff has no pin
        if (!centerStaff.pinHash) continue;

        tx.insert(schema.staffPins)
          .values({ userId: staff.id, pinHash: centerStaff.pinHash, createdAt: now, updatedAt: now })
          .onConflictDoUpdate({
            target: schema.staffPins.userId,
            set: { pinHash: centerStaff.pinHash, updatedAt: now },
          })
          .run();
      }
    });
  }
}
