import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['CASH', 'CREDIT', 'QR']),
  status: z.enum(['SUCCESS', 'FAILED', 'REFUNDED']),
  staffName: z.string().min(1, 'Staff name is required'),
});

export class CreateTransactionDto extends createZodDto(CreateTransactionSchema) {}

export const GetTransactionsFilterSchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val) : 10)),
  id: z.string().optional(),
  startDate: z.string().optional().transform(val => (val ? new Date(val) : undefined)),
  endDate: z.string().optional().transform(val => (val ? new Date(val) : undefined)),
  method: z.enum(['CASH', 'CREDIT', 'QR']).optional(),
  amountRange: z.enum(['0-99', '100-299', '300-499', '500+']).optional(),
  status: z.enum(['SUCCESS', 'FAILED', 'REFUNDED']).optional(),
});

export class GetTransactionsFilterDto extends createZodDto(GetTransactionsFilterSchema) {}
