import { Staff } from '../entities/Staff';

export abstract class StaffRepository {
  abstract findByStaffId(staffId: string): Promise<Staff | null>;
  abstract findById(id: number): Promise<Staff | null>;
  abstract findAll(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }>;
  abstract create(staff: { userId: string; fullName: string; roleId: number; pinHash: string; status: string }): Promise<Staff>;
  abstract findAllToSync(): Promise<Staff[]>;
  abstract updateSyncId(id: number, syncId: string): Promise<void>;
  abstract updateSyncStatus(id: number, userId: string, status: string): Promise<void>;
}
