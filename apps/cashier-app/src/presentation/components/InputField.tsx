import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;

const InputControl = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(15, 23, 42, 0.6);
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  font-size: 1rem;
  transition: ${({ theme }) => theme.transitions.default};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.semantics.colors.border.focus};
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    background-color: rgba(15, 23, 42, 0.8);
  }

  ${({ $hasError, theme }) => $hasError && css`
    border-color: ${theme.semantics.colors.text.error};
  `}
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.semantics.colors.text.error};
`;

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <InputGroup>
        <Label>{label}</Label>
        <InputControl 
          ref={ref}
          $hasError={!!error}
          {...props}
        />
        {error && <ErrorText>{error}</ErrorText>}
      </InputGroup>
    );
  }
);

InputField.displayName = 'InputField';
