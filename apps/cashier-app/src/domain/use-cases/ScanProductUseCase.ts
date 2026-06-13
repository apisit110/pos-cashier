import type { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class ScanProductUseCase {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(barcode: string): Promise<Product> {
    if (!barcode || barcode.trim() === '') {
      throw new Error('Barcode cannot be empty.');
    }

    const product = await this.productRepository.findByBarcode(barcode);
    if (!product) {
      throw new Error(`Product with barcode ${barcode} not found.`);
    }

    return product;
  }
}
