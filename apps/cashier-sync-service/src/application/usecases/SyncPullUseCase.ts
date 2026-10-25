import { SyncState } from '../../domain/entities/SyncState';
import { ISyncMetadataRepository } from '../../domain/repositories/ISyncMetadataRepository';
import { ISyncStateGateway } from '../../domain/repositories/ISyncStateGateway';
import { SyncProductsUseCase } from './SyncProductsUseCase';
import { SyncCashierProfileUseCase } from './SyncCashierProfileUseCase';

export class SyncPullUseCase {
  constructor(
    private readonly syncMetadataRepository: ISyncMetadataRepository,
    private readonly syncStateGateway: ISyncStateGateway,
    private readonly syncProductsUseCase: SyncProductsUseCase,
    private readonly syncCashierProfileUseCase: SyncCashierProfileUseCase,
  ) {}

  /**
   * Pulls products / cashier profile only when their version in pos-center changed.
   * `syncState` comes from a push response; without it the versions are read from pull state.
   */
  async execute(syncState: SyncState | null): Promise<{ products: boolean; profile: boolean }> {
    const state = syncState ?? (await this.syncStateGateway.fetchSyncState());
    const metadata = await this.syncMetadataRepository.getLatest();

    const products = state.hasNewProducts(metadata);
    const profile = state.hasNewProfile(metadata);

    if (products) {
      await this.syncProductsUseCase.execute();
    }
    if (profile) {
      await this.syncCashierProfileUseCase.execute();
    }

    return { products, profile };
  }
}
