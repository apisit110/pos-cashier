import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';
import { OrderRepository } from '../../application/interfaces/OrderRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteOrderRepository implements OrderRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async save(order: Order): Promise<void> {
    this.db.transaction((tx) => {
      tx.insert(schema.orders).values({
        id: order.id,
        totalAmount: order.totalAmount,
        staffId: order.staffId,
        memberId: order.memberId,
        status: order.status,
        createdAt: order.createdAt,
      }).run();

      if (order.items.length > 0) {
        tx.insert(schema.orderItems).values(
          order.items.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        ).run();
      }
    });
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.db.query.orders.findFirst({
      where: eq(schema.orders.id, id),
      with: {
        items: true,
      },
    });

    if (!result) {
      return null;
    }

    const items = result.items.map(
      (item) => new OrderItem(item.productId, item.quantity, item.price),
    );

    return new Order(
      result.id,
      items,
      result.totalAmount,
      result.staffId,
      result.createdAt,
      result.status as OrderStatus,
      result.memberId || undefined,
    );
  }

  async update(order: Order): Promise<void> {
    await this.db
      .update(schema.orders)
      .set({
        status: order.status,
      })
      .where(eq(schema.orders.id, order.id));
  }
}
