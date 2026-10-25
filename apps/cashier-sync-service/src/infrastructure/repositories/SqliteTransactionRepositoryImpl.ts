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
    if (!result) return null;

    // received / change amount live on the payment of the order
    const payment = await this.db.query.payments.findFirst({
      where: eq(schema.payments.orderId, result.orderId),
    });
    return {
      ...result,
      receivedAmount: payment?.receivedAmount ?? null,
      changeAmount: payment?.changeAmount ?? null,
    };
  }

  async markAsSynced(id: string): Promise<void> {
    await this.db.update(schema.transactions).set({ isSynced: true }).where(eq(schema.transactions.id, id));
  }
}
