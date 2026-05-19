import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { StaffInfo, StaffService } from '../../application/interfaces/StaffService';

@Injectable()
export class ApiStaffService implements StaffService {
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
