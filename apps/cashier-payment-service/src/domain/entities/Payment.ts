export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  QR_CODE = 'QR_CODE'
}

export class Payment {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly method: PaymentMethod,
    public status: PaymentStatus = PaymentStatus.PENDING,
    public readonly createdAt: Date,
    public receivedAmount?: number,
    public changeAmount?: number
  ) {}

  complete() {
    this.status = PaymentStatus.SUCCESS;
  }

  fail() {
    this.status = PaymentStatus.FAILED;
  }
}
