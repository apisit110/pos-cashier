import { Product } from '../entities/Product';
import { IProductRepository, ProductFilters } from '../repositories/IProductRepository';

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(filters?: ProductFilters): Promise<Product[]> {
    return this.productRepository.findAll(filters);
  }
}
