import { Inject, Injectable } from '@nestjs/common';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../application/interfaces/ProductRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';

@Injectable()
export class SqliteProductRepository implements ProductRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async findByBarcode(barcode: string): Promise<Product | null> {
    const result = await this.db.query.products.findFirst({
      where: eq(schema.products.barcode, barcode),
    });

    if (!result) {
      return null;
    }

    return new Product(
      result.id,
      result.barcode,
      result.name,
      result.price,
      result.imageUrl,
      result.unitName,
      result.brand,
    );
  }

  async findAll(): Promise<Product[]> {
    const results = await this.db.query.products.findMany();

    return results.map(result => new Product(
      result.id,
      result.barcode,
      result.name,
      result.price,
      result.imageUrl,
      result.unitName,
      result.brand,
    ));
  }

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
            id: product.id, // Update id as well in case it changed in the source
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
