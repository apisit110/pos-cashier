import { Product } from '../../domain/entities/Product';

export interface ProductSyncGateway {
  fetchProducts(
    mid: string,
    sid: string,
    lastSyncVersion: number,
  ): Promise<{ products: Product[]; syncVersion: number }>;
}
