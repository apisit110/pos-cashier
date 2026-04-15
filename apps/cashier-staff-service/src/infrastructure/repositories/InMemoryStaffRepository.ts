import { Injectable } from '@nestjs/common';
import { Staff } from '../../domain/entities/Staff';
import { StaffRepository } from '../../domain/repositories/StaffRepository';

@Injectable()
export class InMemoryStaffRepository implements StaffRepository {
  private readonly staffs: Staff[] = [
    new Staff('staff-67890', 'staff', 'Staff User', 'staff', 'cashier'),
    new Staff('admin-12345', 'admin', 'Admin User', 'admin', 'admin'),
  ];

  async findByEmail(email: string): Promise<Staff | null> {
    return this.staffs.find((s) => s.email === email) || null;
  }
}
