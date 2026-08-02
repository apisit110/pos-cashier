import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq, inArray } from 'drizzle-orm';
import { schema } from '@lightning-pos/model';
import { Order, OrderItem, OrderStatus } from '../entities/Order';
import { PaymentMethod } from '../entities/PaymentMethod';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IStaffService } from '../repositories/IStaffService';
import { ISyncQueueService } from '../repositories/ISyncQueueService';
import { generateOrderId } from '../../utils/generateOrderId';
import { generatePaymentId, generateTransactionId } from '../../utils/generateId';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export interface CheckoutInput {
  items: { productId: string; quantity: number }[];
  memberId?: string;
  paymentMethod: string;
  receivedAmount?: number;
  idempotencyKey?: string;
}

interface PaymentResult {
  status: 'SUCCESS';
  receivedAmount: number;
  changeAmount: number;
}

export class CheckoutUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly staffService: IStaffService,
    private readonly syncQueueService: ISyncQueueService,
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async execute(data: CheckoutInput, staffId: number): Promise<Order> {
    const staff = await this.staffService.findById(staffId);
    if (!staff) throw new NotFoundError(`Staff ${staffId} not found`);

    if (data.items.length === 0) throw new Error('Order must have at least one item');

    // Replaying a checkout with the same idempotencyKey (client retry after a timeout,
    // double-tap, etc.) must never charge or create a duplicate order/transaction.
    let order = data.idempotencyKey
      ? await this.orderRepository.findByIdempotencyKey(data.idempotencyKey)
      : null;

    if (order && order.status === OrderStatus.PAID) {
      const payment = await this.db.query.payments.findFirst({
        where: eq(schema.payments.orderId, order.id),
      });
      (order as any).changeAmount = payment?.changeAmount ?? 0;
      return order;
    }

    const merchantId = process.env.MERCHANT_ID ?? 'DEFAULT_MERCHANT';
    const storeId = process.env.STORE_ID ?? 'DEFAULT_STORE';
    const terminalId = process.env.TERMINAL_ID ?? 'DEFAULT_TERMINAL';

    if (!order) {
      // Prices always come from the products table, never from the client —
      // trusting a client-supplied price would let anyone check out at any amount they choose.
      const productIds = data.items.map((item) => item.productId);
      const products = await this.db.query.products.findMany({
        where: inArray(schema.products.id, productIds),
      });
      const priceById = new Map(products.map((p) => [p.id, p.price]));

      for (const item of data.items) {
        if (!priceById.has(item.productId)) {
          throw new NotFoundError(`Product ${item.productId} not found`);
        }
      }

      const items = data.items.map(
        (item) => new OrderItem(item.productId, item.quantity, priceById.get(item.productId)!),
      );
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      order = new Order(
        generateOrderId(terminalId),
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
        data.idempotencyKey,
      );

      await this.orderRepository.save(order);
      console.log(`Order ${order.id} created with PENDING status.`);
    } else {
      console.log(`Order ${order.id} reused for retried idempotencyKey (previous attempt didn't complete payment).`);
    }

    const paymentResult = this.computePayment(data.paymentMethod, order.totalAmount, data.receivedAmount);
    const paymentId = generatePaymentId();
    const transactionId = generateTransactionId(terminalId);

    order.markAsPaid();

    // payment + order-paid + transaction writes are one atomic DB transaction —
    // avoids the previous split-across-services state where payment could succeed
    // with no transaction record if a later HTTP call failed.
    this.db.transaction((tx) => {
      tx.insert(schema.payments)
        .values({
          id: paymentId,
          orderId: order.id,
          amount: order.totalAmount,
          method: 'CASH',
          status: paymentResult.status,
          createdAt: new Date(),
          receivedAmount: paymentResult.receivedAmount,
          changeAmount: paymentResult.changeAmount,
        })
        .run();

      tx.update(schema.orders)
        .set({ status: order.status, isSynced: order.isSynced })
        .where(eq(schema.orders.id, order.id))
        .run();

      tx.insert(schema.transactions)
        .values({
          id: transactionId,
          orderId: order.id,
          merchantId: order.merchantId,
          storeId: order.storeId,
          terminalId: order.terminalId,
          amount: order.totalAmount,
          paymentMethod: data.paymentMethod,
          status: 'SUCCESS',
          staffName: staff.fullName,
          isSynced: false,
          createdAt: new Date(),
        })
        .run();
    });

    console.log(`Order ${order.id} updated to PAID status and queued for sync.`);
    await this.syncQueueService.addOrderSyncJob(order.id);
    await this.syncQueueService.addTransactionSyncJob(transactionId);
    console.log(`Transaction ${transactionId} queued for sync.`);

    (order as any).changeAmount = paymentResult.changeAmount;
    return order;
  }

  private computePayment(method: string, amount: number, receivedAmount?: number): PaymentResult {
    const supported: PaymentMethod = 'CASH';
    if (method !== supported) {
      throw new Error(`Payment method ${method} is not supported at this time — only CASH is accepted`);
    }
    if (!receivedAmount || receivedAmount < amount) {
      throw new Error('Insufficient cash received');
    }
    return { status: 'SUCCESS', receivedAmount, changeAmount: receivedAmount - amount };
  }
}
