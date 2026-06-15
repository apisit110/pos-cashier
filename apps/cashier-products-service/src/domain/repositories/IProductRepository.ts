import { Product } from '../entities/Product';

export interface ProductFilters {
  barcode?: string;
  name?: string;
  brand?: string;
  price?: number;
}

export interface UpdateProductInput {
  name: string;
  price: number;
  brand?: string | null;
}

export interface IProductRepository {
  findByBarcode(barcode: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  findAll(filters?: ProductFilters): Promise<Product[]>;
  upsertMany(products: Product[]): Promise<void>;
  create(product: Product): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
}
