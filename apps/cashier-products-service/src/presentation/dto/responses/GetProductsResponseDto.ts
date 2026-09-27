import { Product } from '../../../domain/entities/Product';
import { ProductResponseDto } from './ProductResponseDto';

export class GetProductsResponseDto {
  private constructor(readonly products: ProductResponseDto[]) {}

  static fromEntities(products: Product[]): GetProductsResponseDto {
    return new GetProductsResponseDto(products.map((product) => ProductResponseDto.fromEntity(product)));
  }

  toJSON() {
    return this.products;
  }
}
