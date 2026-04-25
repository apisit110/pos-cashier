import { User } from '../entities/User';

export abstract class UserRepository {
  abstract findByUserId(userId: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
  abstract findAll(page: number, limit: number): Promise<{ users: User[]; total: number }>;
  abstract create(user: { userId: string; fullName: string; roleId: number; pinHash: string; status: string }): Promise<User>;
  abstract findAllToSync(): Promise<User[]>;
  abstract updateSyncId(id: number, syncId: string): Promise<void>;
}
