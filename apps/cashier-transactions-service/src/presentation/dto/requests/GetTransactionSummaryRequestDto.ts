import { z } from 'zod';
import { TransactionSummaryPeriod } from '../../../domain/repositories/ITransactionRepository';

export const GetTransactionSummaryQuerySchema = z.object({
  period: z.enum(['hourly', 'daily']),
  startDate: z.string(),
  endDate: z.string(),
  storeId: z.string().optional(),
});

export class GetTransactionSummaryRequestDto {
  private constructor(
    readonly period: TransactionSummaryPeriod,
    readonly startDate: Date,
    readonly endDate: Date,
    readonly storeId?: string,
  ) {}

  static from(query: unknown): GetTransactionSummaryRequestDto {
    const parsed = GetTransactionSummaryQuerySchema.parse(query);
    return new GetTransactionSummaryRequestDto(
      parsed.period,
      new Date(parsed.startDate),
      new Date(parsed.endDate),
      parsed.storeId,
    );
  }
}
