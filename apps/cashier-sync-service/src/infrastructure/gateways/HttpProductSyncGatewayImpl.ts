import { getHttpClient } from '../http/axiosInstance';
import { Product } from '../../domain/entities/Product';
import { IProductSyncGateway } from '../../domain/repositories/IProductSyncGateway';

export class HttpProductSyncGatewayImpl implements IProductSyncGateway {
  async fetchProducts(lastSyncVersion: number): Promise<{ products: Product[]; syncVersion: number }> {
    try {
      // mid / sid are taken from the sync token
      const response = await getHttpClient().post('/pull/products', { syncVersion: lastSyncVersion });
      const data = response.data as { products: any[]; count: number; message?: string };

      const products = data.products.map(
        (p: any) =>
          new Product(p.id, p.barcode, p.name, p.basePrice, p.imageUrl, p.unitName ?? null, p.brand),
      );

      const newSyncVersion = data.products.reduce(
        (max: number, p: any) => Math.max(max, p.syncVersion ?? 0),
        lastSyncVersion,
      );

      return { products, syncVersion: newSyncVersion };
    } catch (error) {
      console.error('[HttpProductSyncGatewayImpl] Error fetching products:', error);
      throw error;
    }
  }
}
