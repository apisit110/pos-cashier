import { Injectable } from '@nestjs/common';
import { TransactionRepository, TransactionFilter } from '../../domain/repositories/TransactionRepository';

@Injectable()
export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(page: number, limit: number, filter?: TransactionFilter) {
    return this.transactionRepository.findAll(page, limit, filter);
  }
}
