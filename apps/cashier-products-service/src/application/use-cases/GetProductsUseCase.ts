import { Injectable, Inject } from '@nestjs/common';
import type { ProductRepository, ProductFilters } from '../interfaces/ProductRepository';
import { Product } from '../../domain/entities/Product';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(filters?: ProductFilters): Promise<Product[]> {
    return await this.productRepository.findAll(filters);
  }
}
