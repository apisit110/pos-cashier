import { Inject, Injectable } from '@nestjs/common';
import { Member } from '../../domain/entities/Member';
import type { MemberRepository } from '../interfaces/MemberRepository';

@Injectable()
export class GetMemberByIdUseCase {
  constructor(
    @Inject('MemberRepository')
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(id: string): Promise<Member | null> {
    return this.memberRepository.findById(id);
  }
}
