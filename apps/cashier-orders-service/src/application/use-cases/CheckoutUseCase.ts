import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';
import type { OrderRepository } from '../interfaces/OrderRepository';
import type { PaymentService } from '../interfaces/PaymentService';
import { PaymentMethod as PSPaymentMethod } from '../interfaces/PaymentService';
import type { TransactionService } from '../interfaces/TransactionService';
import { PaymentMethod } from '../interfaces/TransactionService';
import type { StaffService } from '../interfaces/StaffService';
import { SyncQueueService } from '../../infrastructure/queue/SyncQueueService';

const ULID_ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function generateUlid(): string {
  let ts = Date.now();
  let timeStr = '';
  for (let i = 9; i >= 0; i--) {
    timeStr = ULID_ENCODING[ts % 32] + timeStr;
    ts = Math.floor(ts / 32);
  }
  let randomStr = '';
  for (let i = 0; i < 16; i++) {
    randomStr += ULID_ENCODING[Math.floor(Math.random() * 32)];
  }
  return timeStr + randomStr;
}

export class CheckoutDto {
  items: { productId: string; quantity: number; price: number }[];
  memberId?: string;
  paymentMethod: PaymentMethod;
  receivedAmount?: number;
}


@Injectable()
export class CheckoutUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('PaymentService')
    private readonly paymentService: PaymentService,
    @Inject('TransactionService')
    private readonly transactionService: TransactionService,
    @Inject('StaffService')
    private readonly staffService: StaffService,
    private readonly syncQueueService: SyncQueueService,
    private readonly configService: ConfigService,
  ) {}

  async execute(data: CheckoutDto, staffId: number): Promise<Order> {
    const staff = await this.staffService.findById(staffId);
    if (!staff) throw new NotFoundException(`Staff ${staffId} not found`);

    const staffUsername = staff.username;
    const staffName = staff.fullName;
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

    const merchantId = this.configService.get<string>('MERCHANT_ID', 'DEFAULT_MERCHANT');
    const storeId = this.configService.get<string>('STORE_ID', 'DEFAULT_STORE');
    const terminalId = this.configService.get<string>('TERMINAL_ID', 'DEFAULT_TERMINAL');

    const order = new Order(
      `${merchantId}${storeId}${terminalId}${generateUlid()}`,
      merchantId,
      storeId,
      items,
      totalAmount,
      staffUsername,
      new Date(),
      terminalId,
      OrderStatus.PENDING,
      false,
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
        method: data.paymentMethod === 'CASH' ? PSPaymentMethod.CASH : (data.paymentMethod === 'CREDIT_CARD' ? PSPaymentMethod.CREDIT_CARD : PSPaymentMethod.QR_CODE),
        receivedAmount: data.receivedAmount
      });

      console.log(`Payment Service response for order ${order.id}: status=${paymentData.status}`);
      
      changeAmount = paymentData.changeAmount || 0;
      
      // 4. Update Order to PAID only if payment is SUCCESS
      if (paymentData.status === 'SUCCESS') {
        order.markAsPaid();
        await this.orderRepository.update(order);
        await this.syncQueueService.addOrderSyncJob(order.id);
        console.log(`Order ${order.id} updated to PAID status and queued for sync.`);

        // 5. Create Transaction record and queue sync
        const transactionId = await this.transactionService.createTransaction({
          orderId: order.id,
          merchantId: order.merchantId,
          storeId: order.storeId,
          terminalId: order.terminalId,
          amount: order.totalAmount,
          paymentMethod: data.paymentMethod,
          status: 'SUCCESS',
          staffName: staffName
        });
        await this.syncQueueService.addTransactionSyncJob(transactionId);
        console.log(`Transaction ${transactionId} queued for sync.`);
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
