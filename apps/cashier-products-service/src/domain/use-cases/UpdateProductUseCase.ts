import { Product } from '../entities/Product';
import { IProductRepository, UpdateProductInput } from '../repositories/IProductRepository';
import { IProductSyncGateway } from '../repositories/IProductSyncGateway';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly productSyncGateway: IProductSyncGateway,
  ) {}

  async execute(id: string, input: UpdateProductInput): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Product with id "${id}" not found`);
    }

    const updated = await this.productRepository.update(id, input);
    await this.productSyncGateway.pushProduct(updated);
    return updated;
  }
}
