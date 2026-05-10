import { Inject, Injectable } from '@nestjs/common';
import type { OrderRepository } from '../interfaces/OrderRepository';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(orderId: string) {
    return this.orderRepository.findById(orderId);
  }
}
