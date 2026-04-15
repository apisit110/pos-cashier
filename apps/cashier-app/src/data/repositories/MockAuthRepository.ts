import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { AuthResponse } from '../../domain/entities/User';
import type { LoginCredentials } from '../../domain/entities/Auth';

export class MockAuthRepository implements AuthRepository {
  private STORAGE_KEY = 'lightning_pos_session';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let response: AuthResponse;

    if (credentials.email === 'staff' && credentials.password === 'staff') {
      const payload = {
        uid: 'staff-67890',
        role: 'cashier',
        name: 'Staff User'
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      response = {
        user: {
          id: 'staff-67890',
          email: 'staff@lighting-pos.com',
          name: 'Staff User',
        },
        token,
      };
    } else if (credentials.email === 'admin' && credentials.password === 'admin') {
      response = {
        user: {
          id: 'admin-12345',
          email: credentials.email,
          name: 'Admin User',
        },
        token: 'mock-jwt-admin-token',
      };
    } else {
      throw new Error('Invalid email or password');
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
