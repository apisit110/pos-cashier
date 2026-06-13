import api from '../api/axiosInstance';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { AuthResponse } from '../../domain/entities/Staff';
import type { LoginCredentials } from '../../domain/entities/Auth';

const STORAGE_KEY = 'lightning_pos_session';

export class ApiAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/authen/auth/login', {
      username: credentials.username,
      pin: credentials.pin,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
    return response.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  async getSession(): Promise<AuthResponse | null> {
    const session = localStorage.getItem(STORAGE_KEY);
    if (!session) return null;

    try {
      return JSON.parse(session) as AuthResponse;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
