export interface OrderServiceItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface IOrderService {
  getOrderItems(orderId: string): Promise<OrderServiceItem[]>;
}
