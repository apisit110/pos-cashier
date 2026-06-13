import { randomUUID } from 'crypto';
import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';
import { IProductSyncGateway } from '../repositories/IProductSyncGateway';

export interface CreateProductInput {
  barcode: string;
  name: string;
  price: number;
  brand?: string | null;
}

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly productSyncGateway: IProductSyncGateway,
  ) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const existing = await this.productRepository.findByBarcode(input.barcode);
    if (existing) {
      throw new Error(`Product with barcode "${input.barcode}" already exists`);
    }

    const product = new Product(
      randomUUID(),
      input.barcode,
      input.name,
      input.price,
      null,
      null,
      input.brand ?? null,
    );

    const created = await this.productRepository.create(product);
    await this.productSyncGateway.pushProduct(created);
    return created;
  }
}
