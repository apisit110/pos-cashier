'use client';

import dynamic from 'next/dynamic';
import { StyledThemeProvider } from '../presentation/StyledThemeProvider';
import { LanguageProvider } from '../presentation/i18n/LanguageProvider';

const AuthProvider = dynamic(
  () => import('../presentation/auth/AuthProvider').then((m) => m.AuthProvider),
  { ssr: false },
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledThemeProvider>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </StyledThemeProvider>
  );
}
