import type { AuthResponse } from '../entities/Staff';
import type { AuthRepository } from '../repositories/AuthRepository';
import type { LoginCredentials } from '../entities/Auth';

export class LoginUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!credentials.staffId || !credentials.pin) {
      throw new Error('Staff ID and PIN are required');
    }

    return await this.authRepository.login(credentials);
  }
}
