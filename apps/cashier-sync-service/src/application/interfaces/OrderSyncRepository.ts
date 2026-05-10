export interface OrderSyncRepository {
  syncOrder(order: any): Promise<void>;
}
