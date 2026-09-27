import { TransactionSummaryBucket } from '../../../domain/repositories/ITransactionRepository';

export class TransactionSummaryResponseDto {
  private constructor(readonly buckets: TransactionSummaryBucket[]) {}

  static fromResult(buckets: TransactionSummaryBucket[]): TransactionSummaryResponseDto {
    return new TransactionSummaryResponseDto(buckets);
  }

  toJSON() {
    return { buckets: this.buckets };
  }
}
