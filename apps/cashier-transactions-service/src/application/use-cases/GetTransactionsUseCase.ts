import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';

@Injectable()
export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(page: number, limit: number) {
    return this.transactionRepository.findAll(page, limit);
  }
}
