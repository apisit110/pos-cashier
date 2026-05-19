import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { PinInputField } from '../../components/PinInputField';
import { LoginUseCase } from '../../../domain/use-cases/LoginUseCase';
import { ApiAuthRepository } from '../../../data/repositories/ApiAuthRepository';

// For simplicity, instantiating dependencies here.
const authRepository = new ApiAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

interface LoginPageProps {
  onLoginSuccess?: (userData: { uid: string; username: string; roleId: number; accessToken: string; refreshToken: string }) => void;
}

const float = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
`;

const slideUpFade = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  padding: 1rem;
`;

const BgShape = styled.div<{ $delay: string; $size: string; $color: string; $top?: string; $bottom?: string; $left?: string; $right?: string; $opacity?: number }>`
  position: absolute;
  filter: blur(100px);
  z-index: 0;
  opacity: ${({ $opacity }) => $opacity || 0.5};
  border-radius: 50%;
  animation: ${float} 20s infinite ease-in-out;
  animation-delay: ${({ $delay }) => $delay};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  background: ${({ $color }) => $color};
  top: ${({ $top }) => $top};
  bottom: ${({ $bottom }) => $bottom};
  left: ${({ $left }) => $left};
  right: ${({ $right }) => $right};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  padding: 2.5rem;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: ${({ theme }) => theme.shadows.premium};
  animation: ${slideUpFade} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
    background: linear-gradient(to right, #ffffff, #a5b4fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 0.9375rem;
  }
`;

const BrandLogo = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.semantics.colors.accent.primary}, #c084fc);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.accent};

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: ${({ theme }) => theme.semantics.colors.text.error};
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
  animation: ${shake} 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
`;

const ForgotPassword = styled.a`
  color: ${({ theme }) => theme.semantics.colors.accent.primary};
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #a5b4fc;
  }
`;

const LoginFooter = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};

  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.semantics.colors.accent.primary};
    }
  }
`;

const DemoHint = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  opacity: 0.7;

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
    color: white;
  }
`;

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !pin) {
      setError('Please enter both Username and PIN');
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
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <BgShape $delay="0s" $size="500px" $color="#6366f1" $top="-150px" $right="-100px" />
      <BgShape $delay="-5s" $size="400px" $color="#3b82f6" $bottom="-100px" $left="-150px" />
      <BgShape $delay="-10s" $size="300px" $color="#c084fc" $top="40%" $left="20%" $opacity={0.3} />

      <LoginCard>
        <LoginHeader>
          <BrandLogo>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </BrandLogo>
          <h1>Lightning POS</h1>
          <p>Sign in to access your dashboard</p>
        </LoginHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginForm onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={isLoading}
          />
          
          <PinInputField
            label="PIN Code"
            length={6}
            value={pin}
            onChange={setPin}
            disabled={isLoading}
            boxSize="2.75rem"
          />
          
          <FormActions>
            <ForgotPassword href="#">Forgot PIN?</ForgotPassword>
          </FormActions>

          <Button type="submit" isLoading={isLoading}>
            Sign In
          </Button>
        </LoginForm>

        <LoginFooter>
          <p>Don't have an account? <a href="#">Contact Support</a></p>
          <DemoHint>
            <small>Demo Credentials: <code>00010001</code> / <code>123456</code></small>
          </DemoHint>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};
