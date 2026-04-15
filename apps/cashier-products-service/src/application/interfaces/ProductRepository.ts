import { Product } from '../../domain/entities/Product';

export interface ProductRepository {
  findByBarcode(barcode: string): Promise<Product | null>;
}
