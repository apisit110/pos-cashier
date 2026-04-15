import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Payment, PaymentMethod, PaymentStatus } from '../../domain/entities/Payment';
import { PaymentRepository } from '../../application/interfaces/PaymentRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqlitePaymentRepository implements PaymentRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async save(payment: Payment): Promise<void> {
    await this.db.insert(schema.payments).values({
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      createdAt: payment.createdAt,
      receivedAmount: payment.receivedAmount,
      changeAmount: payment.changeAmount,
    });
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await this.db.query.payments.findFirst({
      where: eq(schema.payments.id, id),
    });

    if (!result) {
      return null;
    }

    return new Payment(
      result.id,
      result.orderId,
      result.amount,
      result.method as PaymentMethod,
      result.status as PaymentStatus,
      result.createdAt,
      result.receivedAmount || undefined,
      result.changeAmount || undefined,
    );
  }

  async update(payment: Payment): Promise<void> {
    await this.db
      .update(schema.payments)
      .set({
        status: payment.status,
        receivedAmount: payment.receivedAmount,
        changeAmount: payment.changeAmount,
      })
      .where(eq(schema.payments.id, payment.id));
  }
}
