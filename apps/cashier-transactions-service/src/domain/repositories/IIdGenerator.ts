export interface IIdGenerator {
  generate(merchantId: string, storeId: string, terminalId?: string): string;
}
