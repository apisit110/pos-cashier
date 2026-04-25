import type { User, UserRepository } from '../../domain/repositories/UserRepository';

export class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async createUser(userData: { fullName: string; roleId: number }): Promise<User> {
    // Generate temp user id (e.g. U + timestamp)
    const tempUserId = `U${Date.now().toString().slice(-6)}`;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      userId: tempUserId,
      fullName: userData.fullName,
      roleId: userData.roleId,
    };
    this.users.push(newUser);
    return newUser;
  }

  async syncUsers(): Promise<void> {
    // Mock sync: leave it empty as requested
    console.log('Syncing users... (Mock)');
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
