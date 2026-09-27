import { Product } from '../../../domain/entities/Product';

export class ProductResponseDto {
  private constructor(
    readonly id: string,
    readonly barcode: string,
    readonly name: string,
    readonly price: number,
    readonly imageUrl?: string | null,
    readonly unitName?: string | null,
    readonly brand?: string | null,
  ) {}

  static fromEntity(product: Product): ProductResponseDto {
    return new ProductResponseDto(
      product.id,
      product.barcode,
      product.name,
      product.price,
      product.imageUrl,
      product.unitName,
      product.brand,
    );
  }

  toJSON() {
    return {
      id: this.id,
      barcode: this.barcode,
      name: this.name,
      price: this.price,
      imageUrl: this.imageUrl,
      unitName: this.unitName,
      brand: this.brand,
    };
  }
}
