import type { User, UserRepository } from '../../domain/repositories/UserRepository';

export class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async createUser(userData: { fullName: string; roleId: number; userId?: string }): Promise<User> {
    // Use provided userId or generate temp user id (e.g. U + timestamp)
    const finalUserId = userData.userId || `U${Date.now().toString().slice(-6)}`;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      userId: finalUserId,
      fullName: userData.fullName,
      roleId: userData.roleId,
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUsers(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = this.users.slice(start, end);
    return {
      users: paginatedUsers,
      total: this.users.length,
    };
  }

  async syncUsers(): Promise<void> {
    // Mock sync: leave it empty as requested
    console.log('Syncing users... (Mock)');
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
