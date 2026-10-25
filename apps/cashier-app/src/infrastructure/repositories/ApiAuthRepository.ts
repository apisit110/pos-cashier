import api from '../api/axiosInstance';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { AuthResponse } from '../../domain/entities/Staff';
import type { LoginCredentials } from '../../domain/entities/Auth';
import type { TerminalInfo } from '../../domain/entities/Terminal';

const STORAGE_KEY = 'lightning_pos_session';
const TERMINAL_STORAGE_KEY = 'lightning_pos_terminal';

export class ApiAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // tid entered on the terminal setup page, authen-service puts tid/mid/sid of this terminal into the JWT
    const terminal = JSON.parse(localStorage.getItem(TERMINAL_STORAGE_KEY) ?? 'null') as TerminalInfo | null;
    if (!terminal?.tid) {
      throw new Error('Terminal is not activated');
    }

    const response = await api.post<AuthResponse>('/authen/auth/login', {
      username: credentials.username,
      pin: credentials.pin,
      tid: terminal.tid,
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
      const parsed = JSON.parse(session) as AuthResponse;
      if (!parsed?.staff?.id || !parsed.accessToken) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
