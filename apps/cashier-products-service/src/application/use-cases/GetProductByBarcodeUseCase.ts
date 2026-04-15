import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../interfaces/ProductRepository';

@Injectable()
export class GetProductByBarcodeUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(barcode: string): Promise<Product> {
    const product = await this.productRepository.findByBarcode(barcode);
    if (!product) {
       throw new NotFoundException(`Product with barcode ${barcode} not found`);
    }
    return product;
  }
}
