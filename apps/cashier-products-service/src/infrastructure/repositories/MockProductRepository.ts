import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../application/interfaces/ProductRepository';

export class MockProductRepository implements ProductRepository {
  private products: Product[] = [
    new Product('1', '8850029016149', 'Singha Water 600ml', 10),
    new Product('2', '8850029016156', 'Chang Water 600ml', 9),
    new Product('3', '1234567890', 'Test Product', 20),
  ];

  async findByBarcode(barcode: string): Promise<Product | null> {
    const product = this.products.find((p) => p.barcode === barcode);
    return product || null;
  }

  async upsertMany(products: Product[]): Promise<void> {
    for (const product of products) {
      const index = this.products.findIndex((p) => p.barcode === product.barcode);
      if (index !== -1) {
        this.products[index] = product;
      } else {
        this.products.push(product);
      }
    }
  }
}
