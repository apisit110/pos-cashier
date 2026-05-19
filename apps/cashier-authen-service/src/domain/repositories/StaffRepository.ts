import { Staff } from '../entities/Staff';

export abstract class StaffRepository {
  abstract findByUsername(username: string): Promise<Staff | null>;
  abstract findById(id: number): Promise<Staff | null>;
  abstract findAll(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }>;
  abstract create(staff: { username: string; fullName: string; roleId: number; pinHash: string; status: string }): Promise<Staff>;
  abstract findAllToSync(): Promise<Staff[]>;
  abstract updateSyncId(id: number, syncId: string): Promise<void>;
  abstract updateSyncStatus(id: number, username: string, status: string): Promise<void>;
}
