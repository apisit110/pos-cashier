import React from 'react';
import styled from 'styled-components';
import { PinInput } from './PinInput';

interface PinInputFieldProps {
  label: string;
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  boxSize?: string;
  error?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.semantics.colors.text.error};
`;

export const PinInputField: React.FC<PinInputFieldProps> = ({
  label,
  length = 6,
  value,
  onChange,
  disabled,
  boxSize,
  error,
}) => {
  return (
    <Container>
      <Label>{label}</Label>
      <PinInput
        length={length}
        value={value}
        onChange={onChange}
        disabled={disabled}
        boxSize={boxSize}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};
