import { IOrderRepository } from '../repositories/IOrderRepository';

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string) {
    return this.orderRepository.findById(orderId);
  }
}
