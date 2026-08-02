import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { schema } from '@lightning-pos/model';

export class SqliteOrderRepositoryImpl implements IOrderRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async save(order: Order): Promise<void> {
    this.db.transaction((tx) => {
      tx.insert(schema.orders)
        .values({
          id: order.id,
          merchantId: order.merchantId,
          storeId: order.storeId,
          terminalId: order.terminalId,
          totalAmount: order.totalAmount,
          staffId: order.staffId,
          memberId: order.memberId,
          status: order.status,
          isSynced: order.isSynced,
          createdAt: order.createdAt,
          idempotencyKey: order.idempotencyKey,
        })
        .run();

      if (order.items.length > 0) {
        tx.insert(schema.orderItems)
          .values(
            order.items.map((item) => ({
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          )
          .run();
      }
    });
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.db.query.orders.findFirst({
      where: eq(schema.orders.id, id),
      with: { items: true },
    });
    if (!result) return null;
    return this.mapToEntity(result);
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Order | null> {
    const result = await this.db.query.orders.findFirst({
      where: eq(schema.orders.idempotencyKey, idempotencyKey),
      with: { items: true },
    });
    if (!result) return null;
    return this.mapToEntity(result);
  }

  private mapToEntity(result: any): Order {
    const items = result.items.map(
      (item: any) => new OrderItem(item.productId, item.quantity, item.price),
    );

    return new Order(
      result.id,
      result.merchantId,
      result.storeId,
      items,
      result.totalAmount,
      result.staffId,
      result.createdAt,
      result.terminalId ?? undefined,
      result.status as OrderStatus,
      result.isSynced,
      result.memberId ?? undefined,
      result.idempotencyKey ?? undefined,
    );
  }

  async update(order: Order): Promise<void> {
    await this.db
      .update(schema.orders)
      .set({ status: order.status, isSynced: order.isSynced })
      .where(eq(schema.orders.id, order.id));
  }
}
