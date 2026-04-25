export class Transaction {
  constructor(
    public readonly id: number,
    public readonly orderNumber: string,
    public readonly amount: number,
    public readonly paymentMethod: string,
    public readonly status: string,
    public readonly staffName: string,
    public readonly createdAt: Date,
  ) {}
}
