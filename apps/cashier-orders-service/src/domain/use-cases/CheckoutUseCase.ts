import { Order, OrderItem, OrderStatus } from '../entities/Order';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IPaymentService, PaymentMethod as PSPaymentMethod } from '../repositories/IPaymentService';
import { ITransactionService, PaymentMethod as TxPaymentMethod } from '../repositories/ITransactionService';
import { IStaffService } from '../repositories/IStaffService';
import { ISyncQueueService } from '../repositories/ISyncQueueService';

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

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export interface CheckoutInput {
  items: { productId: string; quantity: number; price: number }[];
  memberId?: string;
  paymentMethod: TxPaymentMethod;
  receivedAmount?: number;
}

export class CheckoutUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentService: IPaymentService,
    private readonly transactionService: ITransactionService,
    private readonly staffService: IStaffService,
    private readonly syncQueueService: ISyncQueueService,
  ) {}

  async execute(data: CheckoutInput, staffId: number): Promise<Order> {
    const staff = await this.staffService.findById(staffId);
    if (!staff) throw new NotFoundError(`Staff ${staffId} not found`);

    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const items = data.items.map((item) => new OrderItem(item.productId, item.quantity, item.price));

    const merchantId = process.env.MERCHANT_ID ?? 'DEFAULT_MERCHANT';
    const storeId = process.env.STORE_ID ?? 'DEFAULT_STORE';
    const terminalId = process.env.TERMINAL_ID ?? 'DEFAULT_TERMINAL';

    const order = new Order(
      `${merchantId}${storeId}${terminalId}${generateUlid()}`,
      merchantId,
      storeId,
      items,
      totalAmount,
      staff.username,
      new Date(),
      terminalId,
      OrderStatus.PENDING,
      false,
      data.memberId,
    );

    await this.orderRepository.save(order);
    console.log(`Order ${order.id} created with PENDING status.`);

    let changeAmount = 0;
    try {
      const psMethod =
        data.paymentMethod === 'CASH'
          ? PSPaymentMethod.CASH
          : data.paymentMethod === 'CREDIT_CARD'
          ? PSPaymentMethod.CREDIT_CARD
          : PSPaymentMethod.QR_CODE;

      const paymentData = await this.paymentService.processPayment({
        orderId: order.id,
        amount: totalAmount,
        method: psMethod,
        receivedAmount: data.receivedAmount,
      });

      console.log(`Payment Service response for order ${order.id}: status=${paymentData.status}`);
      changeAmount = paymentData.changeAmount ?? 0;

      if (paymentData.status === 'SUCCESS') {
        order.markAsPaid();
        await this.orderRepository.update(order);
        await this.syncQueueService.addOrderSyncJob(order.id);
        console.log(`Order ${order.id} updated to PAID status and queued for sync.`);

        const transactionId = await this.transactionService.createTransaction({
          orderId: order.id,
          merchantId: order.merchantId,
          storeId: order.storeId,
          terminalId: order.terminalId,
          amount: order.totalAmount,
          paymentMethod: data.paymentMethod,
          status: 'SUCCESS',
          staffName: staff.fullName,
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

    (order as any).changeAmount = changeAmount;
    return order;
  }
}
