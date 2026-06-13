import { Order } from '../entities/Order';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  update(order: Order): Promise<void>;
}
