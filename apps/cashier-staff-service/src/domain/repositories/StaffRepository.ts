import { Staff } from '../entities/Staff';

export abstract class StaffRepository {
  abstract findByEmail(email: string): Promise<Staff | null>;
}
