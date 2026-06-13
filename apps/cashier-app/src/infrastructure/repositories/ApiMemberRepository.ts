import { Member } from '../../domain/entities/Member';
import type { MemberRepository } from '../../domain/repositories/MemberRepository';
import api from '../api/axiosInstance';

export class ApiMemberRepository implements MemberRepository {
  async findById(id: string): Promise<Member | null> {
    try {
      const response = await api.get(`/members/${id}`);
      const data = response.data;
      return new Member(data.id, data.firstName, data.lastName, data.points);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }
}
