import { Product } from '../../domain/entities/Product'

export interface IProductRepository {
  findAll: (limit?: number, offset?: number) => Promise<{ items: Product[], total: number }>
  findById: (id: string) => Promise<Product | null>
}
