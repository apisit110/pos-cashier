import type { AuthResponse } from '../entities/Staff';
import type { AuthRepository } from '../repositories/AuthRepository';

export class GetSessionUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<AuthResponse | null> {
    return await this.authRepository.getSession();
  }
}
