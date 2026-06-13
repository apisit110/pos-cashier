import { Product } from '../entities/Product';

export interface IProductSyncGateway {
  fetchProducts(
    mid: string,
    sid: string,
    lastSyncVersion: number,
  ): Promise<{ products: Product[]; syncVersion: number }>;
}
