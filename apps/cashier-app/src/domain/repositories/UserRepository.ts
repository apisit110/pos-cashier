export interface User {
  id: string;
  userId: string;
  fullName: string;
  roleId: number;
}

export interface UserRepository {
  createUser(userData: { fullName: string; roleId: number }): Promise<User>;
  syncUsers(): Promise<void>;
}
