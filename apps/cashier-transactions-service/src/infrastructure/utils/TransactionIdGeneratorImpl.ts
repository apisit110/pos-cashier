import { IIdGenerator } from '../../domain/repositories/IIdGenerator';
import dayjs from './date';
import { customAlphabet } from 'nanoid';

const generateRandom = customAlphabet('0123456789', 1);

export class TransactionIdGeneratorImpl implements IIdGenerator {
  generate(merchantId: string, storeId: string, terminalId?: string): string {
    const timestamp = dayjs().format('YYYYMMDDHHmmssSSS');
    const randomSuffix = generateRandom(3);
    const tid = terminalId ?? '0';
    return `${merchantId}-${storeId}-${tid}-${timestamp}${randomSuffix}`;
  }
}
