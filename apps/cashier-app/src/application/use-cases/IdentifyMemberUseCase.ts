import { Member } from '../../domain/entities/Member';
import type { MemberRepository } from '../../domain/repositories/MemberRepository';

export class IdentifyMemberUseCase {
  private memberRepository: MemberRepository;

  constructor(memberRepository: MemberRepository) {
    this.memberRepository = memberRepository;
  }

  async execute(memberId: string): Promise<Member | null> {
    if (!memberId) return null;
    return this.memberRepository.findById(memberId);
  }
}
