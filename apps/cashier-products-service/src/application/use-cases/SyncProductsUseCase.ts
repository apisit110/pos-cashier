import { Inject, Injectable } from '@nestjs/common';
import type { ProductRepository } from '../interfaces/ProductRepository';
import type { SyncMetadataRepository } from '../interfaces/SyncMetadataRepository';
import type { ProductSyncGateway } from '../interfaces/ProductSyncGateway';

@Injectable()
export class SyncProductsUseCase {

  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('SyncMetadataRepository')
    private readonly syncMetadataRepository: SyncMetadataRepository,
    @Inject('ProductSyncGateway')
    private readonly productSyncGateway: ProductSyncGateway,
  ) {}

  async execute(mid?: string, sid?: string): Promise<{ success: boolean; count: number }> {
    try {
      if (!mid || !sid) {
        throw new Error('MID and SID are required for product synchronization');
      }

      // 1. Get current sync metadata
      const metadata = await this.syncMetadataRepository.getLatest();
      const lastSyncVersion = metadata?.lastProductSyncVersion ?? 0;

      // 2. Set status to SYNCING
      await this.syncMetadataRepository.updateStatus('SYNCING');

      // 3. Fetch products from gateway
      const { products, syncVersion } = await this.productSyncGateway.fetchProducts(
        mid,
        sid,
        lastSyncVersion,
      );

      // 4. Update products in local DB
      await this.productRepository.upsertMany(products);

      // 5. Update metadata with SUCCESS and new sync version
      await this.syncMetadataRepository.upsert({
        lastProductSyncVersion: syncVersion,
        status: 'SUCCESS',
      });

      return {
        success: true,
        count: products.length,
      };
    } catch (error) {
      console.error('[SyncProductsUseCase] Error:', error);
      
      // Update status to ERROR
      await this.syncMetadataRepository.updateStatus('ERROR');
      
      return {
        success: false,
        count: 0,
      };
    }
  }
}
