export interface IOrderRepository {
  findById(id: string): Promise<any>;
  markAsSynced(id: string): Promise<void>;
}
