import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/UserRepository';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(page: number, limit: number) {
    return this.userRepository.findAll(page, limit);
  }
}
