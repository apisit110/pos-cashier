import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { schema } from '@lightning-pos/model';
import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class SqliteProductRepositoryImpl implements IProductRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async upsertMany(products: Product[]): Promise<void> {
    if (products.length === 0) return;

    for (const product of products) {
      await this.db
        .insert(schema.products)
        .values({
          id: product.id,
          barcode: product.barcode,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          unitName: product.unitName,
          brand: product.brand,
        })
        .onConflictDoUpdate({
          target: schema.products.barcode,
          set: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            unitName: product.unitName,
            brand: product.brand,
          },
        });
    }
  }
}
