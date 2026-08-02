import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { schema } from '@lightning-pos/model';
import { IProductService } from '../../domain/repositories/IProductService';

export class SqliteProductServiceImpl implements IProductService {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async getProductName(productId: string): Promise<string | null> {
    const result = await this.db.query.products.findFirst({
      where: eq(schema.products.id, productId),
    });
    return result?.name ?? null;
  }
}
