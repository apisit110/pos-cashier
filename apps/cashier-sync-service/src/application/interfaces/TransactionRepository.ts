export interface TransactionRepository {
  findById(id: string): Promise<any>;
  markAsSynced(id: string): Promise<void>;
}
