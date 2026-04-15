import type { AuthResponse } from '../entities/User';
import type { AuthRepository } from '../repositories/AuthRepository';
import type { LoginCredentials } from '../entities/Auth';

export class LoginUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    // Basic validation logic could go here
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    return await this.authRepository.login(credentials);
  }
}
