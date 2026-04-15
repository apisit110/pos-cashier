import { Inject, Injectable } from '@nestjs/common';
import Database from 'better-sqlite3';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../application/interfaces/ProductRepository';
import { DATABASE_CONNECTION } from '../database/database.provider';

@Injectable()
export class SqliteProductRepository implements ProductRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database.Database,
  ) {}

  async findByBarcode(barcode: string): Promise<Product | null> {
    const row = this.db
      .prepare('SELECT * FROM products WHERE barcode = ?')
      .get(barcode) as any;

    if (!row) {
      return null;
    }

    return new Product(row.id, row.barcode, row.name, row.price);
  }
}
