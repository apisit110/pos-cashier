export type UserRole = 'manager' | 'cashier';

export interface User {
  id: number;
  staffId: string;
  fullName: string;
  roleId: number;
  status: 'active' | 'pending_sync' | 'inactive';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
