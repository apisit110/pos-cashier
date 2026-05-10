import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq, and, gte, lte, SQL, count } from 'drizzle-orm';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionRepository, TransactionFilter } from '../../domain/repositories/TransactionRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteTransactionRepository implements TransactionRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findAll(page: number, limit: number, filter?: TransactionFilter): Promise<{ transactions: Transaction[]; total: number }> {
    const offset = (page - 1) * limit;
    const whereConditions: SQL[] = [];

    if (filter) {
      if (filter.id) {
        whereConditions.push(eq(schema.transactions.id, filter.id));
      }
      if (filter.startDate) {
        whereConditions.push(gte(schema.transactions.createdAt, filter.startDate));
      }
      if (filter.endDate) {
        whereConditions.push(lte(schema.transactions.createdAt, filter.endDate));
      }
      if (filter.method) {
        whereConditions.push(eq(schema.transactions.paymentMethod, filter.method.toUpperCase()));
      }
      if (filter.status) {
        whereConditions.push(eq(schema.transactions.status, filter.status.toUpperCase()));
      }
      if (filter.amountRange) {
        switch (filter.amountRange) {
          case '0-99':
            whereConditions.push(and(gte(schema.transactions.amount, 0), lte(schema.transactions.amount, 99))!);
            break;
          case '100-299':
            whereConditions.push(and(gte(schema.transactions.amount, 100), lte(schema.transactions.amount, 299))!);
            break;
          case '300-499':
            whereConditions.push(and(gte(schema.transactions.amount, 300), lte(schema.transactions.amount, 499))!);
            break;
          case '500+':
            whereConditions.push(gte(schema.transactions.amount, 500));
            break;
        }
      }
    }

    const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const results = await this.db.query.transactions.findMany({
      where,
      limit,
      offset,
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
    });

    const totalCountResult = await this.db
      .select({ count: count() })
      .from(schema.transactions)
      .where(where);
    
    const totalCount = totalCountResult[0]?.count || 0;

    return {
      transactions: results.map(r => this.mapToEntity(r)),
      total: totalCount,
    };
  }
  
  async findById(id: string): Promise<Transaction | null> {
    const results = await this.db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.id, id))
      .limit(1);

    const result = results[0];

    if (!result) {
      return null;
    }

    return this.mapToEntity(result);
  }

  async save(transaction: Transaction): Promise<void> {
    await this.db.insert(schema.transactions).values({
      id: transaction.id,
      orderId: transaction.orderId,
      merchantId: transaction.merchantId,
      storeId: transaction.storeId,
      terminalId: transaction.terminalId,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      staffName: transaction.staffName,
      isSynced: transaction.isSynced,
      createdAt: transaction.createdAt,
    });
  }
  
  async update(transaction: Transaction): Promise<void> {
    await this.db
      .update(schema.transactions)
      .set({
        isSynced: transaction.isSynced,
        status: transaction.status,
      })
      .where(eq(schema.transactions.id, transaction.id));
  }

  private mapToEntity(result: any): Transaction {
    return new Transaction(
      result.id,
      result.orderId,
      result.merchantId,
      result.storeId,
      result.amount,
      result.paymentMethod,
      result.status,
      result.staffName,
      result.createdAt,
      result.terminalId || undefined,
      result.isSynced,
    );
  }
}
