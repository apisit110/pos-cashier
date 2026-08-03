import React, { useState } from 'react';
import { InputField, Button, PinInputField } from '@apisit110/pos-ui';
import { LoginContainer } from './LoginContainer';
import { BgShape } from './BgShape';
import { LoginCard } from './LoginCard';
import { LoginHeader } from './LoginHeader';
import { BrandLogo } from './BrandLogo';
import { ErrorMessage } from './ErrorMessage';
import { LoginForm } from './LoginForm';
import { FormActions } from './FormActions';
import { ForgotPassword } from './ForgotPassword';
import { LoginFooter } from './LoginFooter';
import { DemoHint } from './DemoHint';
import { LoginUseCase } from '../../../domain/use-cases/LoginUseCase';
import { ApiAuthRepository } from '../../../infrastructure/repositories/ApiAuthRepository';
import { useTranslation } from '../../i18n/LanguageContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

const authRepository = new ApiAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

interface LoginPageProps {
  onLoginSuccess?: (userData: { uid: string; username: string; roleId: number; accessToken: string; refreshToken: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !pin) {
      setError(t.login.errorRequired);
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUseCase.execute({ username, pin });
      if (onLoginSuccess) {
        onLoginSuccess({
          uid: response.staff.id.toString(),
          username: response.staff.fullName,
          roleId: response.staff.roleId,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
      }
    } catch (err: any) {
      setError(err.message || t.login.errorFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <BgShape $delay="0s" $size="500px" $color="#6366f1" $top="-150px" $right="-100px" />
      <BgShape $delay="-5s" $size="400px" $color="#3b82f6" $bottom="-100px" $left="-150px" />
      <BgShape $delay="-10s" $size="300px" $color="#c084fc" $top="40%" $left="20%" $opacity={0.3} />

      <LanguageSwitcher style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 1 }} />

      <LoginCard>
        <LoginHeader>
          <BrandLogo>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </BrandLogo>
          <h1>{t.login.title}</h1>
          <p>{t.login.subtitle}</p>
        </LoginHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginForm onSubmit={handleSubmit}>
          <InputField
            label={t.login.username}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t.login.usernamePlaceholder}
            disabled={isLoading}
            autoFocus
          />

          <PinInputField
            label={t.login.pin}
            length={6}
            value={pin}
            onChange={setPin}
            disabled={isLoading}
            boxSize="2.75rem"
          />

          <FormActions>
            <ForgotPassword href="#">{t.login.forgotPin}</ForgotPassword>
          </FormActions>

          <Button type="submit" isLoading={isLoading}>
            {t.login.signIn}
          </Button>
        </LoginForm>

        <LoginFooter>
          <p>{t.login.noAccount} <a href="#">{t.login.contactSupport}</a></p>
          <DemoHint>
            <small>{t.login.demoCredentials} <code>00010001</code> / <code>123456</code></small>
          </DemoHint>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};
