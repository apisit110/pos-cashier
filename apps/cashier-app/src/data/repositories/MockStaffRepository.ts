import type { Staff, StaffRepository } from '../../domain/repositories/StaffRepository';

export class MockStaffRepository implements StaffRepository {
  private staffs: Staff[] = [];

  async createStaff(staffData: { fullName: string; roleId: number; userId?: string }): Promise<Staff> {
    const finalUserId = staffData.userId || `U${Date.now().toString().slice(-6)}`;
    const newStaff: Staff = {
      id: Math.random().toString(36).substr(2, 9),
      userId: finalUserId,
      fullName: staffData.fullName,
      roleId: staffData.roleId,
    };
    this.staffs.push(newStaff);
    return newStaff;
  }

  async getStaffs(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      staffs: this.staffs.slice(start, end),
      total: this.staffs.length,
    };
  }

  async syncStaffs(): Promise<void> {
    console.log('Syncing staffs... (Mock)');
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
