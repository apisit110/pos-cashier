export interface User {
  id: string;
  userId: string;
  fullName: string;
  roleId: number;
}

export interface UserRepository {
  createUser(userData: { fullName: string; roleId: number; userId?: string; pin: string }): Promise<User>;
  getUsers(page: number, limit: number): Promise<{ users: User[]; total: number }>;
  syncUsers(): Promise<void>;
}
