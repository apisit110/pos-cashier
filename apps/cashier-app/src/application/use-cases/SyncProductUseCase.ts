import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class SyncProductUseCase {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<{ success: boolean; count: number }> {
    return this.productRepository.syncProducts();
  }
}
