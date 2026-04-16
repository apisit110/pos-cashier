import axios from 'axios';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { AuthResponse } from '../../domain/entities/User';
import type { LoginCredentials } from '../../domain/entities/Auth';

export class ApiAuthRepository implements AuthRepository {
  private readonly baseUrl = 'http://localhost:3005/v1/staff/auth';
  private readonly STORAGE_KEY = 'lightning_pos_session';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${this.baseUrl}/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    const authData = response.data;

    // Persist session
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
    
    return authData;
  }

  async logout(): Promise<void> {
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
