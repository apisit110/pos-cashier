import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { schema } from '@lightning-pos/model';
import { IOrderService, OrderServiceItem } from '../../domain/repositories/IOrderService';

export class SqliteOrderServiceImpl implements IOrderService {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async getOrderItems(orderId: string): Promise<OrderServiceItem[]> {
    const results = await this.db.query.orderItems.findMany({
      where: eq(schema.orderItems.orderId, orderId),
    });
    return results.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
  }
}
