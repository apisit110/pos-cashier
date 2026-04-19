import { Product } from '../entities/Product';

export interface ProductRepository {
  findByBarcode(barcode: string): Promise<Product | null>;
  getAllProducts(): Promise<Product[]>;
  syncProducts(): Promise<{ success: boolean; count: number }>;
}
