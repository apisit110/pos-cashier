import axios from 'axios';
import type { UserRepository, User } from '../../domain/repositories/UserRepository';

export class ApiUserRepository implements UserRepository {
  private readonly baseUrl = 'http://localhost:3005/v1/authen/users';

  async getUsers(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const response = await axios.get<{ users: any[]; total: number }>(this.baseUrl, {
      params: { page, limit }
    });

    return {
      users: response.data.users.map((u: any) => ({
        id: u.id.toString(),
        userId: u.userId,
        fullName: u.fullName,
        roleId: u.roleId,
      })),
      total: response.data.total,
    };
  }

  async createUser(userData: { fullName: string; roleId: number; userId?: string; pin: string }): Promise<User> {
    const response = await axios.post<any>(this.baseUrl, {
      userId: userData.userId,
      fullName: userData.fullName,
      roleId: userData.roleId,
      pin: userData.pin,
    });

    const u = response.data;
    return {
      id: u.id.toString(),
      userId: u.userId,
      fullName: u.fullName,
      roleId: u.roleId,
    };
  }

  async syncUsers(): Promise<void> {
    await axios.post(`${this.baseUrl}/sync`);
  }
}
