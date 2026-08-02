import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { schema } from '@lightning-pos/model';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

export class SqliteTransactionRepositoryImpl implements ITransactionRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async findById(id: string): Promise<any> {
    const result = await this.db.query.transactions.findFirst({
      where: eq(schema.transactions.id, id),
    });
    return result ?? null;
  }

  async markAsSynced(id: string): Promise<void> {
    await this.db.update(schema.transactions).set({ isSynced: true }).where(eq(schema.transactions.id, id));
  }
}
