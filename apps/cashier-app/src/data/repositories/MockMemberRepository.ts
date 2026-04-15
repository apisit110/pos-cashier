import { Member } from '../../domain/entities/Member';
import type { MemberRepository } from '../../domain/repositories/MemberRepository';

export class MockMemberRepository implements MemberRepository {
  private members: Member[] = [
    new Member('M001', 'Alice', 'Johnson', 1500),
    new Member('M002', 'Bob', 'Smith', 450),
    new Member('M003', 'Charlie', 'Brown', 50),
    new Member('0987654321', 'Somchai', 'Jaidi', 1250),
  ];

  async findById(id: string): Promise<Member | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.members.find(m => m.id === id) || null;
  }
}
