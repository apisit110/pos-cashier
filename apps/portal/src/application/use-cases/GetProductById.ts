import { IProductRepository } from '../interfaces/IProductRepository'
import { Product } from '../../domain/entities/Product'

export class GetProductById {
  constructor (
    private readonly productRepository: IProductRepository
  ) {}

  async execute (id: string): Promise<Product | null> {
    return await this.productRepository.findById(id)
  }
}
