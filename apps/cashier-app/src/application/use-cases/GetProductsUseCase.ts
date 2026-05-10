import { Product } from '../../domain/entities/Product';
import type { ProductRepository, ProductFilters } from '../../domain/repositories/ProductRepository';

export class GetProductsUseCase {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(filters?: ProductFilters): Promise<Product[]> {
    return this.productRepository.getAllProducts(filters);
  }
}
