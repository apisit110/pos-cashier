import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { schema } from '@lightning-pos/model';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';

export class SqliteOrderRepositoryImpl implements IOrderRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async findById(id: string): Promise<any> {
    const result = await this.db.query.orders.findFirst({
      where: eq(schema.orders.id, id),
      with: { items: true },
    });
    return result ?? null;
  }

  async markAsSynced(id: string): Promise<void> {
    await this.db.update(schema.orders).set({ isSynced: true }).where(eq(schema.orders.id, id));
  }
}
