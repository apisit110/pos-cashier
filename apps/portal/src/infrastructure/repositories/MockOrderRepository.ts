import { IOrderRepository } from '../../application/interfaces/IOrderRepository'
import { Order } from '../../domain/entities/Order'

export class MockOrderRepository implements IOrderRepository {
  private readonly orders: Order[] = [
    new Order('ORD-1001', 'Anonymous Customer', '฿1,250.00', 'delivered', '2026-04-12 10:30', 3, 'walk-in'),
    new Order('ORD-1002', 'Anonymous Customer', '฿450.00', 'processing', '2026-04-12 11:15', 1, 'delivery'),
    new Order('ORD-1003', 'Anonymous Customer', '฿3,200.00', 'pending', '2026-04-12 11:45', 5, 'delivery'),
    new Order('ORD-1004', 'Anonymous Customer', '฿890.00', 'cancelled', '2026-04-12 12:20', 2, 'walk-in'),
    new Order('ORD-1005', 'Anonymous Customer', '฿5,600.00', 'shipped', '2026-04-12 13:05', 4, 'delivery'),
    new Order('ORD-1006', 'Anonymous Customer', '฿150.00', 'delivered', '2026-04-12 13:40', 1, 'walk-in'),
    new Order('ORD-1007', 'Anonymous Customer', '฿2,100.00', 'pending', '2026-04-12 14:10', 3, 'delivery'),
    new Order('ORD-1008', 'Anonymous Customer', '฿670.00', 'processing', '2026-04-12 14:55', 2, 'walk-in'),
    new Order('ORD-1009', 'Anonymous Customer', '฿1,500.00', 'delivered', '2026-04-12 15:25', 2, 'delivery'),
    new Order('ORD-1010', 'Anonymous Customer', '฿340.00', 'delivered', '2026-04-12 15:50', 1, 'walk-in'),
    new Order('ORD-1011', 'Anonymous Customer', '฿9,900.00', 'shipped', '2026-04-12 16:15', 6, 'delivery'),
    new Order('ORD-1012', 'Anonymous Customer', '฿1,200.00', 'delivered', '2026-04-12 16:40', 2, 'walk-in')
  ]

  async findAll (): Promise<Order[]> {
    return await Promise.resolve(this.orders)
  }

  async findById (id: string): Promise<Order | null> {
    const order = this.orders.find(o => o.id === id)
    return order ?? null
  }
}
