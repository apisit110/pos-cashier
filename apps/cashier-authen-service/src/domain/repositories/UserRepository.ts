import { User } from '../entities/User';

export abstract class UserRepository {
  abstract findByStaffId(staffId: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
}
