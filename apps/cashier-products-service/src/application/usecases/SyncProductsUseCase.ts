import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ISyncMetadataRepository } from '../../domain/repositories/ISyncMetadataRepository';
import { IProductCenterRepository } from '../../domain/repositories/IProductCenterRepository';

export class SyncProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly syncMetadataRepository: ISyncMetadataRepository,
    private readonly productCenterRepository: IProductCenterRepository,
    private readonly appMode: 'online' | 'offline' = 'online',
  ) {}

  async execute(mid?: string, sid?: string): Promise<{ success: boolean; count: number }> {
    if (this.appMode === 'offline') {
      console.warn('[SyncProductsUseCase] Skipped: APP_MODE=offline');
      await this.syncMetadataRepository.updateStatus('ERROR');
      return { success: false, count: 0 };
    }

    try {
      if (!mid || !sid) {
        throw new Error('MID and SID are required for product synchronization');
      }

      const metadata = await this.syncMetadataRepository.getLatest();
      const lastSyncVersion = metadata?.lastProductSyncVersion ?? 0;

      await this.syncMetadataRepository.updateStatus('SYNCING');

      const { products, syncVersion } = await this.productCenterRepository.fetchProducts(
        mid,
        sid,
        lastSyncVersion,
      );

      await this.productRepository.upsertMany(products);

      await this.syncMetadataRepository.upsert({
        lastProductSyncVersion: syncVersion,
        status: 'SUCCESS',
      });

      return { success: true, count: products.length };
    } catch (error) {
      console.error('[SyncProductsUseCase] Error:', error);
      await this.syncMetadataRepository.updateStatus('ERROR');
      return { success: false, count: 0 };
    }
  }
}
