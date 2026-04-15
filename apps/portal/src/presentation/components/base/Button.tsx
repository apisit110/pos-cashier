import styled, { keyframes, css } from 'styled-components'
import { tokens } from '../../styles/tokens'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  isLoading?: boolean
}

export const Button = styled.button<ButtonProps>`
  width: 100%;
  padding: ${tokens.button.padding};
  background: ${props => props.variant === 'primary' || props.variant == null ? tokens.button.background : 'transparent'};
  color: ${tokens.button.color};
  border: ${props => props.variant === 'secondary' ? `1px solid ${tokens.button.secondary.border}` : 'none'};
  border-radius: ${tokens.button.borderRadius};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.button.gap};
  outline: none;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    ${props => (props.variant === 'primary' || props.variant == null) && css`
      box-shadow: ${tokens.button.shadow};
      filter: brightness(1.1);
    `}
    ${props => props.variant === 'secondary' && css`
      background: ${tokens.button.secondary.hoverBackground};
    `}
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .animate-spin {
    animation: ${spin} 1s linear infinite;
  }
`
