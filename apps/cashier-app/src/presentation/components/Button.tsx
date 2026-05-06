import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Loader = styled.span`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${spin} 0.8s linear infinite;
`;

const StyledButton = styled.button<{ $variant: 'primary' | 'secondary' | 'danger'; $isLoading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  border: none;
  width: 100%;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.components.button.primary.bg};
          color: ${theme.components.button.primary.text};
          box-shadow: 0 4px 10px -2px rgba(99, 102, 241, 0.4);

          &:hover:not(:disabled) {
            background-color: ${theme.components.button.primary.hover};
            transform: translateY(-1px);
            box-shadow: 0 6px 15px -3px rgba(99, 102, 241, 0.5);
          }
        `;
      case 'secondary':
        return css`
          background-color: transparent;
          color: ${theme.semantics.colors.text.primary};
          border: 1px solid ${theme.semantics.colors.border.subtle};

          &:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.05);
            border-color: ${theme.semantics.colors.accent.primary};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.components.button.error.text};
          color: white;

          &:hover:not(:disabled) {
            filter: brightness(1.2);
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  ...props 
}) => {
  return (
    <StyledButton 
      $variant={variant} 
      $isLoading={isLoading}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader /> : children}
    </StyledButton>
  );
};
