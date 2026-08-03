'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { TerminalSetupPage } from '../pages/terminal-setup/TerminalSetupPage';
import { useTranslation } from '../i18n/LanguageContext';
import { authRepository, getSessionUseCase } from '../di/container';
import { AuthContext, homeRouteFor, type AuthStaff, type LoginSuccessData } from './AuthContext';

const InitializingLoader = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;

const TERMINAL_STORAGE_KEY = 'lightning_pos_terminal';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [hasTerminal, setHasTerminal] = useState(() => !!localStorage.getItem(TERMINAL_STORAGE_KEY));
  const [staff, setStaff] = useState<AuthStaff | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSessionUseCase.execute();
        if (session) {
          setStaff({
            uid: session.staff.id.toString(),
            username: session.staff.fullName,
            roleId: session.staff.roleId,
            role: session.staff.roleId === 1 ? 'manager' : 'cashier',
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
          });
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
  }, []);

  const login = (data: LoginSuccessData) => {
    setStaff({
      uid: data.uid,
      username: data.username,
      roleId: data.roleId,
      role: data.roleId === 1 ? 'manager' : 'cashier',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    router.push(homeRouteFor(data.roleId));
  };

  const logout = async () => {
    try {
      await authRepository.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setStaff(null);
      router.push('/login');
    }
  };

  if (!hasTerminal) {
    return <TerminalSetupPage onComplete={() => setHasTerminal(true)} />;
  }

  if (isInitializing) {
    return <InitializingLoader>{t.common.loadingApp}</InitializingLoader>;
  }

  return (
    <AuthContext.Provider value={{ staff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
