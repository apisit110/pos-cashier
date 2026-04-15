import { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class MockProductRepository implements ProductRepository {
  private products: Product[] = [
    new Product('1', '8850123456789', 'Premium Arabica Coffee Bean', 15.99),
    new Product('2', '8850123456790', 'Organic Green Tea Match', 12.50),
    new Product('3', '8850123456791', 'Ceramic Espresso Cup', 8.00),
    new Product('4', '8850123456792', 'Stainless Steel Tumbler', 25.00),
    new Product('5', '1234567890123', 'Demo Product', 9.99)
  ];

  async findByBarcode(barcode: string): Promise<Product | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.products.find(p => p.barcode === barcode) || null;
  }

  async getAllProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.products];
  }
}
