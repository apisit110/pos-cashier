export class Transaction {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly merchantId: string,
    public readonly storeId: string,
    public readonly amount: number,
    public readonly paymentMethod: string,
    public readonly status: string,
    public readonly staffName: string,
    public readonly createdAt: Date,
    public readonly terminalId?: string,
    public isSynced: boolean = false,
  ) {}
}
