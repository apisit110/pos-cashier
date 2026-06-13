import { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class MockProductRepository implements ProductRepository {
  private products: Product[] = [
    new Product('1', '8850123456789', 'Premium Arabica Coffee Bean', 15.99, undefined, 'Coffee Co'),
    new Product('2', '8850123456790', 'Organic Green Tea Match', 12.50, undefined, 'Tea House'),
    new Product('3', '8850123456791', 'Ceramic Espresso Cup', 8.00, undefined, 'Home Goods'),
    new Product('4', '8850123456792', 'Stainless Steel Tumbler', 25.00, undefined, 'EcoGear'),
    new Product('5', '1234567890123', 'Demo Product', 9.99, undefined, 'Generic')
  ];

  async findByBarcode(barcode: string): Promise<Product | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.products.find(p => p.barcode === barcode) || null;
  }

  async getAllProducts(filters?: any): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    let result = [...this.products];
    
    if (filters) {
      if (filters.barcode) {
        result = result.filter(p => p.barcode.toLowerCase().includes(filters.barcode.toLowerCase()));
      }
      if (filters.name) {
        result = result.filter(p => p.name.toLowerCase().includes(filters.name.toLowerCase()));
      }
      if (filters.brand) {
        result = result.filter(p => (p.brand || '').toLowerCase().includes(filters.brand.toLowerCase()));
      }
      if (filters.price) {
        result = result.filter(p => p.price.toString().includes(filters.price.toString()));
      }
    }
    
    return result;
  }

  async syncProducts(_mid: string, _sid: string): Promise<{ success: boolean; count: number }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, count: 0 };
  }
}
