export interface OrderRepository {
  findById(id: string): Promise<any>;
  markAsSynced(id: string): Promise<void>;
}
