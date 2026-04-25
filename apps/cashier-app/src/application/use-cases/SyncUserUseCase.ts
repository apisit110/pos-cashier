import type { UserRepository } from '../../domain/repositories/UserRepository';

export class SyncUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<void> {
    return this.userRepository.syncUsers();
  }
}
