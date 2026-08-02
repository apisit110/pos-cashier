import { z } from 'zod';

export const GetTransactionsFilterSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  id: z.string().optional(),
  orderId: z.string().optional(),
  startDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  endDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  method: z.enum(['CASH', 'CREDIT', 'QR']).optional(),
  amountRange: z.enum(['0-99', '100-299', '300-499', '500+']).optional(),
  status: z.enum(['SUCCESS', 'FAILED', 'REFUNDED']).optional(),
});

export type GetTransactionsFilter = z.infer<typeof GetTransactionsFilterSchema>;
