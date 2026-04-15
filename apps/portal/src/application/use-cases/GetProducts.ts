import { IProductRepository } from '../interfaces/IProductRepository'
import { Product } from '../../domain/entities/Product'

export class GetProducts {
  constructor (
    private readonly productRepository: IProductRepository
  ) {}

  async execute (limit?: number, offset?: number): Promise<{ items: Product[], total: number }> {
    return await this.productRepository.findAll(limit, offset)
  }
}
