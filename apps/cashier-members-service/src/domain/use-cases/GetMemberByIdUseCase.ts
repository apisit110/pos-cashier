import { Member } from '../entities/Member';
import { IMemberRepository } from '../repositories/IMemberRepository';

export class GetMemberByIdUseCase {
  constructor(private readonly memberRepository: IMemberRepository) {}

  async execute(id: string): Promise<Member | null> {
    return this.memberRepository.findById(id);
  }
}
