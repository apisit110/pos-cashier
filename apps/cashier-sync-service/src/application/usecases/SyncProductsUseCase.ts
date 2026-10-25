import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ISyncMetadataRepository } from '../../domain/repositories/ISyncMetadataRepository';
import { IProductSyncGateway } from '../../domain/repositories/IProductSyncGateway';

export class SyncProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly syncMetadataRepository: ISyncMetadataRepository,
    private readonly productSyncGateway: IProductSyncGateway,
  ) {}

  async execute(): Promise<{ success: boolean; count: number }> {
    try {
      const metadata = await this.syncMetadataRepository.getLatest();
      const lastSyncVersion = metadata?.lastProductSyncVersion ?? 0;

      await this.syncMetadataRepository.updateStatus('SYNCING');

      const { products, syncVersion } = await this.productSyncGateway.fetchProducts(lastSyncVersion);

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
