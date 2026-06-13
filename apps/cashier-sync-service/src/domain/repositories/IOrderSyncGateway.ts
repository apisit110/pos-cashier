export interface IOrderSyncGateway {
  syncOrder(order: any): Promise<void>;
}
