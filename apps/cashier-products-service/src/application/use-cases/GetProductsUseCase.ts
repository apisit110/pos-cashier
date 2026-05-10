import { Injectable, Inject } from '@nestjs/common';
import type { ProductRepository } from '../interfaces/ProductRepository';
import { Product } from '../../domain/entities/Product';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}
