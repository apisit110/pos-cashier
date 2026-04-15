import { Inject, Injectable } from '@nestjs/common';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';
import type { OrderRepository } from '../interfaces/OrderRepository';
import type { PaymentService } from '../interfaces/PaymentService';
import { PaymentMethod } from '../interfaces/PaymentService';

export class CheckoutDto {
  items: { productId: string; quantity: number; price: number }[];
  memberId?: string;
  paymentMethod: 'CASH' | 'CREDIT' | 'QR';
  receivedAmount?: number;
}


@Injectable()
export class CheckoutUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('PaymentService')
    private readonly paymentService: PaymentService
  ) {}

  async execute(data: CheckoutDto, staffId: string): Promise<Order> {
    // 1. Calculate final values
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalAmount = subtotal;

    // 2. Create Order in PENDING state
    const items = data.items.map(
      (item) => new OrderItem(item.productId, item.quantity, item.price)
    );

    const order = new Order(
      Math.random().toString(36).substring(2, 9),
      items,
      totalAmount,
      staffId,
      new Date(),
      OrderStatus.PENDING,
      data.memberId
    );

    await this.orderRepository.save(order);
    console.log(`Order ${order.id} created with PENDING status.`);

    // 3. Process Payment (Transaction) - Calling the Payment Service Interface
    let changeAmount = 0;
    try {
      const paymentData = await this.paymentService.processPayment({
        orderId: order.id,
        amount: totalAmount,
        method: data.paymentMethod === 'CASH' ? PaymentMethod.CASH : (data.paymentMethod === 'CREDIT' ? PaymentMethod.CREDIT_CARD : PaymentMethod.QR_CODE),
        receivedAmount: data.receivedAmount
      });

      console.log(`Payment Service response for order ${order.id}: status=${paymentData.status}`);
      
      changeAmount = paymentData.changeAmount || 0;
      
      // 4. Update Order to PAID only if payment is SUCCESS
      if (paymentData.status === 'SUCCESS') {
        order.markAsPaid();
        await this.orderRepository.save(order);
        console.log(`Order ${order.id} updated to PAID status.`);
      } else {
        console.log(`Order ${order.id} remains PENDING (waiting for payment confirmation)`);
      }

    } catch (error) {
      console.error(`Payment failed for order ${order.id}:`, (error as Error).message);
      throw error;
    }

    // Attach change amount for frontend display
    (order as any).changeAmount = changeAmount;
    
    return order;
  }
}
