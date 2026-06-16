import { IProductSyncGateway } from '../../domain/repositories/IProductSyncGateway';
import { Product } from '../../domain/entities/Product';
import { httpClient } from '../http/axiosInstance';

export class HttpProductSyncGatewayImpl implements IProductSyncGateway {
  async pushProduct(product: Product): Promise<void> {
    const mid = process.env.MID;
    const sid = process.env.SID;
    if (!mid || !sid) {
      throw new Error('MID and SID environment variables are required for product upload');
    }

    const payload = {
      mid,
      sid,
      products: [
        {
          id: product.id,
          barcode: product.barcode,
          name: product.name,
          basePrice: product.price,
          imageUrl: product.imageUrl ?? null,
          unitName: product.unitName ?? null,
          brand: product.brand ?? null,
        },
      ],
    };

    try {
      const response = await httpClient.post('/products/receive', payload);
      const result = response.data?.results?.[0];
      if (result?.status === 'error') {
        throw new Error(`pos-center failed to upload product ${product.id}`);
      }
    } catch (error: any) {
      console.error('[HttpProductSyncGatewayImpl] Error uploading product:', error.message);
      throw error;
    }
  }

  async fetchProducts(
    mid: string,
    sid: string,
    lastSyncVersion: number,
  ): Promise<{ products: Product[]; syncVersion: number }> {
    try {
      const response = await httpClient.post('/products', { mid, sid, syncVersion: lastSyncVersion });
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
