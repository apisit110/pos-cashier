import { generateUlid } from './generateOrderId';

export function generatePaymentId(): string {
  return generateUlid();
}

export function generateTransactionId(terminalId?: string): string {
  return `${terminalId ?? '0'}${generateUlid()}`;
}
