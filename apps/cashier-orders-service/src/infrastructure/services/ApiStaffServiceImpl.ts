import axios from 'axios';
import { IStaffService, StaffInfo } from '../../domain/repositories/IStaffService';

export class ApiStaffServiceImpl implements IStaffService {
  private readonly baseUrl = 'http://localhost:3005/internal/v1/staffs';

  async findById(id: number): Promise<StaffInfo | null> {
    try {
      const response = await axios.get<StaffInfo>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }
}
