import { Product } from '../../domain/entities/Product';

export interface ProductSyncGateway {
  fetchProducts(
    merchantId: string,
    storeId: string,
    lastSyncVersion: string | null,
  ): Promise<{ products: Product[]; syncVersion: string }>;
}
