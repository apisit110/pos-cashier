import { ITransactionRepository } from '../interfaces/ITransactionRepository'
import { Transaction } from '../../domain/entities/Transaction'

export class GetTransactionById {
  constructor (
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute (id: string): Promise<Transaction | null> {
    return await this.transactionRepository.findById(id)
  }
}
