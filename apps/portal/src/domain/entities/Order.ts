export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type OrderType = 'walk-in' | 'delivery'

export interface OrderProps {
  id: string
  customerName: string
  totalAmount: string
  status: OrderStatus
  createdAt: string
  itemCount: number
  type: OrderType
}

export class Order {
  constructor (
    public readonly id: string,
    public readonly customerName: string,
    public readonly totalAmount: string,
    public readonly status: OrderStatus,
    public readonly createdAt: string,
    public readonly itemCount: number,
    public readonly type: OrderType
  ) {}
}
