import type { User, UserRepository } from '../../domain/repositories/UserRepository';

export class CreateUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: { fullName: string; roleId: number }): Promise<User> {
    return this.userRepository.createUser(userData);
  }
}
