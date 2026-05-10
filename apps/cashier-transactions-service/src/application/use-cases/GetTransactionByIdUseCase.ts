import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';

@Injectable()
export class GetTransactionByIdUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: number) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
