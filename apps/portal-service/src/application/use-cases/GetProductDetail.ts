import { IProductRepository } from '../interfaces/IProductRepository'
import { Product } from '../../domain/entities/Product'

export class GetProductDetail {
  constructor (private readonly productRepository: IProductRepository) {}

  async execute (id: string): Promise<Product | null> {
    if (id == null) {
      throw new Error('ID is required')
    }
    return await this.productRepository.findById(id)
  }
}
