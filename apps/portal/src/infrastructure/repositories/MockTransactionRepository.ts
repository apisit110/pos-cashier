import { ITransactionRepository } from '../../application/interfaces/ITransactionRepository'
import { Transaction } from '../../domain/entities/Transaction'

export class MockTransactionRepository implements ITransactionRepository {
  private readonly transactions: Transaction[] = [
    new Transaction('TX-001', '2026-04-12 10:30', 'Anonymous Customer', '฿1,250.00', 'completed', 'sale', 'Visa'),
    new Transaction('TX-002', '2026-04-12 11:15', 'Anonymous Customer', '฿450.00', 'completed', 'sale', 'Mastercard'),
    new Transaction('TX-003', '2026-04-12 11:45', 'Anonymous Customer', '฿3,200.00', 'pending', 'sale', 'Bank Transfer'),
    new Transaction('TX-004', '2026-04-12 12:20', 'Anonymous Customer', '฿890.00', 'failed', 'sale', 'PromptPay'),
    new Transaction('TX-005', '2026-04-12 13:05', 'Anonymous Customer', '฿12,000.00', 'completed', 'payout', 'Cash'),
    new Transaction('TX-006', '2026-04-12 13:40', 'Anonymous Customer', '฿150.00', 'refunded', 'refund', 'Visa'),
    new Transaction('TX-007', '2026-04-12 14:10', 'Anonymous Customer', '฿2,100.00', 'completed', 'sale', 'Mastercard'),
    new Transaction('TX-008', '2026-04-12 14:55', 'Anonymous Customer', '฿670.00', 'completed', 'sale', 'Visa'),
    new Transaction('TX-009', '2026-04-12 15:25', 'Anonymous Customer', '฿1,500.00', 'pending', 'sale', 'PromptPay'),
    new Transaction('TX-010', '2026-04-12 15:50', 'Anonymous Customer', '฿340.00', 'completed', 'sale', 'Cash'),
    new Transaction('TX-011', '2026-04-12 16:15', 'Anonymous Customer', '฿9,900.00', 'completed', 'sale', 'Visa'),
    new Transaction('TX-012', '2026-04-12 16:40', 'Anonymous Customer', '฿1,200.00', 'completed', 'sale', 'Mastercard')
  ]

  async findAll (): Promise<Transaction[]> {
    return await Promise.resolve(this.transactions)
  }

  async findById (id: string): Promise<Transaction | null> {
    const tx = this.transactions.find(t => t.id === id)
    return tx ?? null
  }
}
