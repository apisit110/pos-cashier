import { Injectable } from '@nestjs/common';
import { ProductSyncGateway } from '../../application/interfaces/ProductSyncGateway';
import { Product } from '../../domain/entities/Product';

@Injectable()
export class HttpProductSyncGateway implements ProductSyncGateway {
  async fetchProducts(
    merchantId: string,
    storeId: string,
    lastSyncVersion: string | null,
  ): Promise<{ products: Product[]; syncVersion: string }> {
    console.log(`[HttpProductSyncGateway] Fetching products for merchant=${merchantId}, store=${storeId}, version=${lastSyncVersion}`);
    
    // For now, return empty array and a dummy version
    // In a real scenario, this would call the portal-service
    return {
      products: [],
      syncVersion: new Date().toISOString(),
    };
  }
}
