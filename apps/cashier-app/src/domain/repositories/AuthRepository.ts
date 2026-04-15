import type { AuthResponse } from '../entities/User';
import type { LoginCredentials } from '../entities/Auth';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getSession(): Promise<AuthResponse | null>;
}
