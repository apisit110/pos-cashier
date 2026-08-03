import { createContext, useContext } from 'react';

export interface AuthStaff {
  uid: string;
  username: string;
  role: string;
  roleId: number;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginSuccessData {
  uid: string;
  username: string;
  roleId: number;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  staff: AuthStaff | null;
  login: (data: LoginSuccessData) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const homeRouteFor = (roleId: number) => (roleId === 1 ? '/dashboard' : '/pos');

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
