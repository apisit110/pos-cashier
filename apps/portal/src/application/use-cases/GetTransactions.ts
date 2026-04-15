import { ITransactionRepository } from '../interfaces/ITransactionRepository'
import { Transaction } from '../../domain/entities/Transaction'

export class GetTransactions {
  constructor (
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute (): Promise<Transaction[]> {
    return await this.transactionRepository.findAll()
  }
}
