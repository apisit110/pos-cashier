import styled, { css } from 'styled-components';
import { scanSuccess } from './keyframes';

export const ScannerBox = styled.div<{ $isScanning?: boolean; $flash?: boolean }>`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px dashed ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.25rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: ${({ theme }) => theme.transitions.default};
  animation: ${({ $flash }) => $flash ? css`${scanSuccess} 0.5s ease-out` : 'none'};

  ${({ $isScanning, theme }) => $isScanning && css`
    border-color: ${theme.semantics.colors.accent.primary};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  `}

  svg {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
    opacity: 0.8;
  }

  p {
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 0.8125rem;
  }
`;
