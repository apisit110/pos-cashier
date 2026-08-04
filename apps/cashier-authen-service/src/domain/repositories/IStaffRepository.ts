import { Staff } from '../entities/Staff';

export interface IStaffRepository {
  findByUsername(username: string): Promise<Staff | null>;
  findById(id: number): Promise<Staff | null>;
  findAll(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }>;
  create(staff: {
    username: string;
    fullName: string;
    roleId: number;
    status: string;
    syncStatus: string;
  }): Promise<Staff>;
  findAllToSync(): Promise<Staff[]>;
  updateSyncStatus(id: number, username: string, syncStatus: string): Promise<void>;
  countAll(): Promise<number>;
}
