import { Product } from '../entities/Product';

export interface ProductFilters {
  barcode?: string;
  name?: string;
  brand?: string;
  price?: number;
}

export interface CreateProductInput {
  barcode: string;
  name: string;
  brand?: string;
  price: number;
}

export interface ProductRepository {
  findByBarcode(barcode: string): Promise<Product | null>;
  getAllProducts(filters?: ProductFilters): Promise<Product[]>;
  syncProducts(mid: string, sid: string): Promise<{ success: boolean; count: number }>;
  createProduct(input: CreateProductInput): Promise<Product>;
}
