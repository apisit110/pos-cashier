import dayjs from './date';
import { customAlphabet } from 'nanoid';

const generateRandom = customAlphabet('0123456789', 1);

export const generateTransactionId = (
  merchantId: string,
  storeId: string,
  terminalId?: string,
): string => {
  const timestamp = dayjs().format('YYYYMMDDHHmmssSSS');
  const randomSuffix = generateRandom(3);
  const tid = terminalId ?? '0';
  return `${merchantId}-${storeId}-${tid}-${timestamp}${randomSuffix}`;
};
