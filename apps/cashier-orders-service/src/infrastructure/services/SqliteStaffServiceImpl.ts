import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { schema } from '@lightning-pos/model';
import { IStaffService, StaffInfo } from '../../domain/repositories/IStaffService';

export class SqliteStaffServiceImpl implements IStaffService {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async findById(id: number): Promise<StaffInfo | null> {
    const result = await this.db.query.staffs.findFirst({
      where: eq(schema.staffs.id, id),
    });
    if (!result) return null;
    return { username: result.username, fullName: result.fullName };
  }
}
