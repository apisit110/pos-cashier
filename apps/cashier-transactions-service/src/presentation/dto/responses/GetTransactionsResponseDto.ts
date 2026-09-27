import { Transaction } from '../../../domain/entities/Transaction';
import { TransactionResponseDto } from './TransactionResponseDto';

export class GetTransactionsResponseDto {
  private constructor(
    readonly transactions: TransactionResponseDto[],
    readonly total: number,
  ) {}

  static fromResult(result: { transactions: Transaction[]; total: number }): GetTransactionsResponseDto {
    return new GetTransactionsResponseDto(
      result.transactions.map((transaction) => TransactionResponseDto.fromEntity(transaction)),
      result.total,
    );
  }

  toJSON() {
    return { transactions: this.transactions, total: this.total };
  }
}
