import type { ProductRepository, CreateProductInput } from '../repositories/ProductRepository';
import type { Product } from '../entities/Product';

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    return this.productRepository.createProduct(input);
  }
}
