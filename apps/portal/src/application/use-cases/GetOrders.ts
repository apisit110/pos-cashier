import { IOrderRepository } from '../interfaces/IOrderRepository'
import { Order } from '../../domain/entities/Order'

export class GetOrders {
  constructor (
    private readonly orderRepository: IOrderRepository
  ) {}

  async execute (): Promise<Order[]> {
    return await this.orderRepository.findAll()
  }
}
