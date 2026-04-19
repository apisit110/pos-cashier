import { Injectable } from '@nestjs/common';
import { ProductSyncGateway } from '../../application/interfaces/ProductSyncGateway';
import { Product } from '../../domain/entities/Product';

@Injectable()
export class HttpProductSyncGateway implements ProductSyncGateway {
  async fetchProducts(
    merchantId: string,
    storeId: string,
    lastSyncVersion: number,
  ): Promise<{ products: Product[]; syncVersion: number }> {
    const url = 'http://localhost:3005/v1/sync/products';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId,
          storeId,
          syncVersion: lastSyncVersion,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch products: ${response.status} ${errorText}`);
      }

      const data = await response.json() as { 
        products: any[]; 
        count: number;
        message?: string;
      };

      const products = data.products.map((p: any) => new Product(
        p.id,
        p.barcode,
        p.name,
        p.basePrice,
        p.imageUrl,
        p.unitName || null, // unitName might not be in SyncProduct schema but is in our table
        p.brand,
      ));

      // The new sync version should be the highest syncVersion in the returned products,
      // or the current lastSyncVersion if no products were returned.
      const newSyncVersion = data.products.reduce(
        (max: number, p: any) => Math.max(max, p.syncVersion || 0),
        lastSyncVersion,
      );

      return {
        products,
        syncVersion: newSyncVersion,
      };
    } catch (error) {
      console.error('[HttpProductSyncGateway] Error fetching products:', error);
      throw error;
    }
  }
}
