import { Order } from '../../domain/entities/Order'

export interface IOrderRepository {
  findAll: () => Promise<Order[]>
  findById: (id: string) => Promise<Order | null>
}
