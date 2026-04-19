import { Product } from '../../domain/entities/Product';

export interface ProductSyncGateway {
  fetchProducts(
    merchantId: string,
    storeId: string,
    lastSyncVersion: number,
  ): Promise<{ products: Product[]; syncVersion: number }>;
}
