import { Member } from '../../domain/entities/Member';
import type { MemberRepository } from '../../domain/repositories/MemberRepository';
import api from '../../infrastructure/api/axiosInstance';

export class ApiMemberRepository implements MemberRepository {
  private readonly baseUrl = 'http://localhost:3004/v1';

  async findById(id: string): Promise<Member | null> {
    try {
      const response = await api.get(`${this.baseUrl}/members/${id}`);
      const data = response.data;
      return new Member(
        data.id,
        data.firstName,
        data.lastName,
        data.points
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching member by ID:', error);
      throw error;
    }
  }
}
