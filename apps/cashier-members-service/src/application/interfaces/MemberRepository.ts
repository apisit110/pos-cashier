import { Member } from '../../domain/entities/Member';

export interface MemberRepository {
  findById(id: string): Promise<Member | null>;
}
