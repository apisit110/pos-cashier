import type { User, UserRepository } from '../../domain/repositories/UserRepository';

export class GetUsersUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    return this.userRepository.getUsers(page, limit);
  }
}
