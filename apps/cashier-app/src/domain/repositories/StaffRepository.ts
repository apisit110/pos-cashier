export interface Staff {
  id: string;
  userId: string;
  fullName: string;
  roleId: number;
}

export interface StaffRepository {
  createStaff(staffData: { fullName: string; roleId: number; userId?: string; pin: string }): Promise<Staff>;
  getStaffs(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }>;
  syncStaffs(): Promise<void>;
}
