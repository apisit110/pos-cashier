import { Product } from '../entities/Product';

export interface IProductRepository {
  upsertMany(products: Product[]): Promise<void>;
}
