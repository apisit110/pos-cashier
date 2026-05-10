import { Product } from '../../domain/entities/Product';

export interface ProductFilters {
  barcode?: string;
  name?: string;
  brand?: string;
  price?: number;
}

export interface ProductRepository {
  findByBarcode(barcode: string): Promise<Product | null>;
  findAll(filters?: ProductFilters): Promise<Product[]>;
  upsertMany(products: Product[]): Promise<void>;
}
