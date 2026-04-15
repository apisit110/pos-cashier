import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Staff } from '../../domain/entities/Staff';
import { StaffRepository } from '../../domain/repositories/StaffRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteStaffRepository implements StaffRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findByEmail(email: string): Promise<Staff | null> {
    const result = await this.db.query.staff.findFirst({
      where: eq(schema.staff.email, email),
    });

    if (!result) {
      return null;
    }

    return new Staff(result.id, result.email, result.name, result.password, result.role as 'admin' | 'cashier');
  }
}
