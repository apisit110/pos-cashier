import { IProductCenterRepository } from '../../domain/repositories/IProductCenterRepository';
import { Product } from '../../domain/entities/Product';
import { getHttpClient } from '../http/axiosInstance';

export class HttpProductCenterRepositoryImpl implements IProductCenterRepository {
  async pushProduct(product: Product): Promise<void> {
    // mid / sid are taken from the sync token
    const payload = {
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
      const response = await getHttpClient().post('/push/products', payload);
      const result = response.data?.results?.[0];
      if (result?.status === 'error') {
        throw new Error(`pos-center failed to upload product ${product.id}`);
      }
    } catch (error: any) {
      console.error('[HttpProductCenterRepositoryImpl] Error uploading product:', error.message);
      throw error;
    }
  }
}
