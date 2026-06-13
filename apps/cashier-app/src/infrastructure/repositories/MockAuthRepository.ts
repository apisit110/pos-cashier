import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { AuthResponse } from '../../domain/entities/Staff';
import type { LoginCredentials } from '../../domain/entities/Auth';

export class MockAuthRepository implements AuthRepository {
  private STORAGE_KEY = 'lightning_pos_session';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let response: AuthResponse;

    if (credentials.staffId === 'M001' && credentials.pin === '123456') {
      response = {
        staff: {
          id: 1,
          userId: 'M001',
          fullName: 'Admin Manager',
          roleId: 1,
          status: 'active'
        },
        accessToken: 'mock-access-token-manager',
        refreshToken: 'mock-refresh-token-manager'
      };
    } else {
      throw new Error('Invalid Staff ID or PIN');
    }

    // Persist session
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
    return response;
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async getSession(): Promise<AuthResponse | null> {
    const session = localStorage.getItem(this.STORAGE_KEY);
    if (!session) return null;
    
    try {
      return JSON.parse(session) as AuthResponse;
    } catch (e) {
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
}
