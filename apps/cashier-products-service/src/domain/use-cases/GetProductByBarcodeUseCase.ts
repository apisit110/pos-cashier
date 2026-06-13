import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class GetProductByBarcodeUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(barcode: string): Promise<Product> {
    const product = await this.productRepository.findByBarcode(barcode);
    if (!product) {
      throw new NotFoundError(`Product with barcode ${barcode} not found`);
    }
    return product;
  }
}
