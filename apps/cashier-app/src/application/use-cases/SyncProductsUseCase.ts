import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class SyncProductsUseCase {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(mid: string, sid: string): Promise<{ success: boolean; count: number }> {
    return this.productRepository.syncProducts(mid, sid);
  }
}
