import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Terminal } from '../../domain/entities/Terminal';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteTerminalRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findByTid(tid: string): Promise<Terminal | null> {
    const result = await this.db.query.terminals.findFirst({
      where: eq(schema.terminals.tid, tid),
    });

    if (!result) return null;

    return new Terminal(result.tid, result.mid, result.sid, result.isAvailable);
  }

  async updateAvailability(tid: string, isAvailable: boolean): Promise<void> {
    await this.db
      .update(schema.terminals)
      .set({ isAvailable })
      .where(eq(schema.terminals.tid, tid));
  }
}
