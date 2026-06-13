export interface ITransactionRepository {
  findById(id: string): Promise<any>;
  markAsSynced(id: string): Promise<void>;
}
