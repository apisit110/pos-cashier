import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../application/interfaces/ProductRepository';
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

    return new Product(result.id, result.barcode, result.name, result.price);
  }
}
