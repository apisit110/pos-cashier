import dayjs from './date';
import { customAlphabet } from 'nanoid';

const generateRandom = customAlphabet('0123456789', 1);

/**
 * Generates a transaction ID with format YYYYMMDDHHmmssSSS + 3 random digits
 */
export const generateTransactionId = (): string => {
  const timestamp = dayjs().format('YYYYMMDDHHmmssSSS');
  const randomSuffix = generateRandom(3);
  return `${timestamp}${randomSuffix}`;
};
