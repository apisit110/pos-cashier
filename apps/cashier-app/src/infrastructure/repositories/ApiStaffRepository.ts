import api from '../api/axiosInstance';
import type { StaffRepository, Staff } from '../../domain/repositories/StaffRepository';

export class ApiStaffRepository implements StaffRepository {
  async getStaffs(page: number, limit: number): Promise<{ staffs: Staff[]; total: number }> {
    const response = await api.get<{ staffs: any[]; total: number }>('/authen/staffs', {
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
    const response = await api.post<any>('/authen/staffs', {
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
    await api.post('/authen/staffs/sync');
  }
}
