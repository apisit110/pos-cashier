import { OrderItem, Transaction } from '../../../domain/entities/Transaction';

export class TransactionResponseDto {
  private constructor(
    readonly id: string,
    readonly orderId: string,
    readonly merchantId: string,
    readonly storeId: string,
    readonly amount: number,
    readonly paymentMethod: string,
    readonly status: string,
    readonly staffName: string,
    readonly createdAt: Date,
    readonly isSynced: boolean,
    readonly orderItems: OrderItem[],
    readonly terminalId?: string,
  ) {}

  static fromEntity(transaction: Transaction): TransactionResponseDto {
    return new TransactionResponseDto(
      transaction.id,
      transaction.orderId,
      transaction.merchantId,
      transaction.storeId,
      transaction.amount,
      transaction.paymentMethod,
      transaction.status,
      transaction.staffName,
      transaction.createdAt,
      transaction.isSynced,
      transaction.orderItems,
      transaction.terminalId,
    );
  }

  toJSON() {
    return {
      id: this.id,
      orderId: this.orderId,
      merchantId: this.merchantId,
      storeId: this.storeId,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      status: this.status,
      staffName: this.staffName,
      createdAt: this.createdAt,
      terminalId: this.terminalId,
      isSynced: this.isSynced,
      orderItems: this.orderItems,
    };
  }
}
