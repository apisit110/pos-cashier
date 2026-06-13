import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { and, like, eq, SQL } from 'drizzle-orm';
import { Product } from '../../domain/entities/Product';
import { IProductRepository, ProductFilters } from '../../domain/repositories/IProductRepository';
import * as schema from '../database/schema';

export class SqliteProductRepositoryImpl implements IProductRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async findByBarcode(barcode: string): Promise<Product | null> {
    const result = await this.db.query.products.findFirst({
      where: eq(schema.products.barcode, barcode),
    });

    if (!result) return null;

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

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const { barcode, name, brand, price } = filters ?? {};

    const results = await this.db.query.products.findMany({
      where: (products) => {
        const conditions: SQL[] = [];
        if (barcode) conditions.push(like(products.barcode, `%${barcode}%`));
        if (name) conditions.push(like(products.name, `%${name}%`));
        if (brand) conditions.push(like(products.brand, `%${brand}%`));
        if (price !== undefined) conditions.push(eq(products.price, price));
        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });

    return results.map(
      (r) => new Product(r.id, r.barcode, r.name, r.price, r.imageUrl, r.unitName, r.brand),
    );
  }

  async create(product: Product): Promise<Product> {
    await this.db.insert(schema.products).values({
      id: product.id,
      barcode: product.barcode,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      unitName: product.unitName,
      brand: product.brand,
    });
    return product;
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
