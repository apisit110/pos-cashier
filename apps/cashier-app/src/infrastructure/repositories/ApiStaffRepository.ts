import axios from 'axios';
import type { StaffRepository, Staff } from '../../domain/repositories/StaffRepository';

export class ApiStaffRepository implements StaffRepository {
  private readonly baseUrl = 'http://localhost:3000/api/v1/authen/staffs';

  async getStaffs(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }> {
    const response = await axios.get<{ staffs: any[]; total: number }>(this.baseUrl, {
      params: { page, limit },
    });

    return {
      staffs: response.data.staffs.map((s: any) => ({
        id: s.id.toString(),
        userId: s.username,
        fullName: s.fullName,
        roleId: s.roleId,
      })),
      total: response.data.total,
    };
  }

  async createStaff(staffData: { fullName: string; roleId: number; userId?: string; pin: string }): Promise<Staff> {
    const response = await axios.post<any>(this.baseUrl, {
      fullName: staffData.fullName,
      roleId: staffData.roleId,
      pin: staffData.pin,
    });

    const s = response.data;
    return {
      id: s.id.toString(),
      userId: s.username,
      fullName: s.fullName,
      roleId: s.roleId,
    };
  }

  async syncStaffs(): Promise<void> {
    await axios.post(`${this.baseUrl}/sync`);
  }
}
