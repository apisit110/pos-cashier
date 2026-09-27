import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { inArray } from 'drizzle-orm';
import { schema } from '@lightning-pos/model';

export interface CalculateOrderInput {
  items: { productId: string; quantity: number }[];
  memberId?: string;
}

export interface CalculateOrderResult {
  total: number;
  appliedPromotions: string[];
}

export class CalculateOrderUseCase {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async execute(data: CalculateOrderInput): Promise<CalculateOrderResult> {
    const productIds = data.items.map((item) => item.productId);
    const products = await this.db.query.products.findMany({
      where: inArray(schema.products.id, productIds),
    });
    const priceById = new Map(products.map((p) => [p.id, p.price]));

    const total = data.items.reduce((sum, item) => {
      const price = priceById.get(item.productId) ?? 0;
      return sum + price * item.quantity;
    }, 0);

    return { total, appliedPromotions: [] };
  }
}
