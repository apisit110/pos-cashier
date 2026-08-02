const ULID_ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function generateUlid(): string {
  let ts = Date.now();
  let timeStr = '';
  for (let i = 9; i >= 0; i--) {
    timeStr = ULID_ENCODING[ts % 32] + timeStr;
    ts = Math.floor(ts / 32);
  }
  let randomStr = '';
  for (let i = 0; i < 16; i++) {
    randomStr += ULID_ENCODING[Math.floor(Math.random() * 32)];
  }
  return timeStr + randomStr;
}

export function generateOrderId(terminalId: string): string {
  return `${terminalId}${generateUlid()}`;
}
