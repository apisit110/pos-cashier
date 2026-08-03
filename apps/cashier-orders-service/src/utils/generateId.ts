import dayjs from '@lightning-pos/datetime';
import { generateUlid } from './generateOrderId';

const ID_ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function randomSuffix(length: number): string {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += ID_ENCODING[Math.floor(Math.random() * ID_ENCODING.length)];
  }
  return str;
}

export function generatePaymentId(): string {
  return generateUlid();
}

// Timestamp-first so ids stay lexicographically sortable by creation time.
// Second-level precision (not ms) needs the random suffix to disambiguate
// same-second checkouts on the same terminal.
export function generateTransactionId(terminalId?: string): string {
  return `${dayjs().format('YYYYMMDDHHmmss')}${terminalId ?? '0'}${randomSuffix(4)}`;
}
