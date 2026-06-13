import axios from 'axios';
import { IProductSyncGateway } from '../../domain/repositories/IProductSyncGateway';
import { Product } from '../../domain/entities/Product';

export class HttpProductSyncGatewayImpl implements IProductSyncGateway {
  async fetchProducts(
    mid: string,
    sid: string,
    lastSyncVersion: number,
  ): Promise<{ products: Product[]; syncVersion: number }> {
    const url = 'http://127.0.0.1:4002/v1/sync/products';

    try {
      const response = await axios.post(url, { mid, sid, syncVersion: lastSyncVersion });
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
