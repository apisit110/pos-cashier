import { IOrderRepository } from '../interfaces/IOrderRepository'
import { Order } from '../../domain/entities/Order'

export class GetOrderById {
  constructor (
    private readonly orderRepository: IOrderRepository
  ) {}

  async execute (id: string): Promise<Order | null> {
    return await this.orderRepository.findById(id)
  }
}
