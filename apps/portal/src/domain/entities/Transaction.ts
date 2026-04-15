export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded'
export type TransactionType = 'sale' | 'refund' | 'payout'

export interface TransactionProps {
  id: string
  date: string
  customer: string
  amount: string
  status: TransactionStatus
  type: TransactionType
  paymentMethod: string
}

export class Transaction {
  constructor (
    public readonly id: string,
    public readonly date: string,
    public readonly customer: string,
    public readonly amount: string,
    public readonly status: TransactionStatus,
    public readonly type: TransactionType,
    public readonly paymentMethod: string
  ) {}
}
