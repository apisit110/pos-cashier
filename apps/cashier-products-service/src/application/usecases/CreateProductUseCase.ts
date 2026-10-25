import { randomUUID } from 'crypto';
import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ISyncOutboxRepository } from '../../domain/repositories/ISyncOutboxRepository';

export interface CreateProductInput {
  barcode: string;
  name: string;
  price: number;
  brand?: string | null;
}

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly syncOutboxRepository: ISyncOutboxRepository,
  ) {}

  /**
   * Upserts by barcode: updates the detail of an existing product (keeping its id), otherwise inserts a new one.
   * Both cases are enqueued to the sync outbox to be pushed to pos-center
   */
  async execute(input: CreateProductInput): Promise<{ product: Product; created: boolean }> {
    const existing = await this.productRepository.findByBarcode(input.barcode);
    if (existing) {
      const updated = await this.productRepository.update(existing.id, {
        name: input.name,
        price: input.price,
        brand: input.brand,
      });
      await this.syncOutboxRepository.enqueue(updated);
      return { product: updated, created: false };
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
    await this.syncOutboxRepository.enqueue(created);
    return { product: created, created: true };
  }
}
