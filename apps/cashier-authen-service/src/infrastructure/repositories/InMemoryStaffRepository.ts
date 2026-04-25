import { Injectable } from '@nestjs/common';
import { Staff } from '../../domain/entities/Staff';
import { StaffRepository } from '../../domain/repositories/StaffRepository';

@Injectable()
export class InMemoryStaffRepository implements StaffRepository {
  private readonly staffs: Staff[] = [
    new Staff('staff-67890', 'staff', 'Staff User', 'staff', 'staff'),
    new Staff('manager-12345', 'manager', 'Manager User', 'manager', 'manager'),
  ];


  async findByEmail(email: string): Promise<Staff | null> {
    return this.staffs.find((s) => s.email === email) || null;
  }
}
