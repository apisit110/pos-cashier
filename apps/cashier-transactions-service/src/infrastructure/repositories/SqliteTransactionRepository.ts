import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteTransactionRepository implements TransactionRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findAll(page: number, limit: number): Promise<{ transactions: Transaction[]; total: number }> {
    const offset = (page - 1) * limit;

    const results = await this.db.query.transactions.findMany({
      limit,
      offset,
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
    });

    const allTransactions = this.db.select().from(schema.transactions).all();
    const totalCount = allTransactions.length;

    return {
      transactions: results.map(r => this.mapToEntity(r)),
      total: totalCount,
    };
  }

  private mapToEntity(result: any): Transaction {
    return new Transaction(
      result.id,
      result.orderNumber,
      result.amount,
      result.paymentMethod,
      result.status,
      result.staffName,
      result.createdAt,
    );
  }
}
