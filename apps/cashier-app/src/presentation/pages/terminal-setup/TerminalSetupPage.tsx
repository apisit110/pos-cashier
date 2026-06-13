import React, { useState } from 'react';
import { InputField, Button } from '@apisit110/pos-ui';
import { Container } from './Container';
import { BgShape } from './BgShape';
import { Card } from './Card';
import { Header } from './Header';
import { BrandLogo } from './BrandLogo';
import { ErrorMessage } from './ErrorMessage';
import { Form } from './Form';
import { InfoText } from './InfoText';
import { ActivateTerminalUseCase } from '../../../domain/use-cases/ActivateTerminalUseCase';
import { ApiTerminalRepository } from '../../../infrastructure/repositories/ApiTerminalRepository';

const terminalRepository = new ApiTerminalRepository();
const activateTerminalUseCase = new ActivateTerminalUseCase(terminalRepository);

interface TerminalSetupPageProps {
  onComplete: () => void;
}

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
