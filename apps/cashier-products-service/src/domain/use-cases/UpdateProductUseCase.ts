import { Product } from '../entities/Product';
import { IProductRepository, UpdateProductInput } from '../repositories/IProductRepository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, input: UpdateProductInput): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Product with id "${id}" not found`);
    }

    return this.productRepository.update(id, input);
  }
}
