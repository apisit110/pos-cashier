import { Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/Order';
import { OrderRepository } from '../../application/interfaces/OrderRepository';

@Injectable()
export class MockOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async save(order: Order): Promise<void> {
    this.orders.push(order);
    console.log('Order saved:', order);
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id);
    return order || null;
  }

  async update(order: Order): Promise<void> {
    const index = this.orders.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      this.orders[index] = order;
      console.log('Order updated:', order);
    }
  }
}
