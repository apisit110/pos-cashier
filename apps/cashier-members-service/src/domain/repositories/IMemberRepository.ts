import { Member } from '../entities/Member';

export interface IMemberRepository {
  findById(id: string): Promise<Member | null>;
}
