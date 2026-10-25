import { Product } from '../entities/Product';

export interface IProductSyncGateway {
  fetchProducts(lastSyncVersion: number): Promise<{ products: Product[]; syncVersion: number }>;
}
