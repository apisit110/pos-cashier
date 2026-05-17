import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { ActivateTerminalUseCase } from '../../../domain/use-cases/ActivateTerminalUseCase';
import { ApiTerminalRepository } from '../../../data/repositories/ApiTerminalRepository';

const terminalRepository = new ApiTerminalRepository();
const activateTerminalUseCase = new ActivateTerminalUseCase(terminalRepository);

interface TerminalSetupPageProps {
  onComplete: () => void;
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

const Container = styled.div`
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

const Card = styled.div`
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

const Header = styled.div`
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
  background: linear-gradient(135deg, ${({ theme }) => theme.semantics.colors.accent.primary}, #22d3ee);
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InfoText = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: 0.8125rem;
  text-align: center;
  opacity: 0.7;

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
    color: white;
  }
`;

export const TerminalSetupPage: React.FC<TerminalSetupPageProps> = ({ onComplete }) => {
  const [tid, setTid] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tid.trim()) {
      setError('Please enter a Terminal ID');
      return;
    }

    setIsLoading(true);
    try {
      await activateTerminalUseCase.execute(tid);
      onComplete();
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Terminal activation failed. Please try again.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BgShape $delay="0s" $size="500px" $color="#0ea5e9" $top="-150px" $right="-100px" />
      <BgShape $delay="-5s" $size="400px" $color="#6366f1" $bottom="-100px" $left="-150px" />
      <BgShape $delay="-10s" $size="300px" $color="#22d3ee" $top="40%" $left="20%" $opacity={0.3} />

      <Card>
        <Header>
          <BrandLogo>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </BrandLogo>
          <h1>Terminal Setup</h1>
          <p>Enter your Terminal ID to activate this POS</p>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputField
            label="Terminal ID"
            type="text"
            value={tid}
            onChange={(e) => setTid(e.target.value)}
            placeholder="e.g. T1"
            disabled={isLoading}
            autoFocus
          />

          <Button type="submit" isLoading={isLoading}>
            Activate Terminal
          </Button>
        </Form>

        <InfoText>
          <small>Contact your manager if you don't know your Terminal ID</small>
        </InfoText>
      </Card>
    </Container>
  );
};
