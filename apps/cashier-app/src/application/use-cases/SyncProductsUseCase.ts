import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class SyncProductsUseCase {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<{ success: boolean; count: number }> {
    return await this.productRepository.syncProducts();
  }
}
