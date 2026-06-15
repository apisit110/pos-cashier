import type { ProductRepository, UpdateProductInput } from '../repositories/ProductRepository';
import type { Product } from '../entities/Product';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, input: UpdateProductInput): Promise<Product> {
    return this.productRepository.updateProduct(id, input);
  }
}
