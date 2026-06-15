import { Product } from './Product';

export class SyncOutboxEntry {
  constructor(
    public readonly id: string,
    public readonly product: Product,
    public readonly retryCount: number,
  ) {}
}
