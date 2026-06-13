import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div<{ $size: number; $thickness: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: ${({ $thickness }) => $thickness}px solid rgba(255, 255, 255, 0.15);
  border-top-color: ${({ theme }) => theme.semantics.colors.accent.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  flex-shrink: 0;
`;

const Wrapper = styled.div<{ $fullscreen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  ${({ $fullscreen }) =>
    $fullscreen &&
    `
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(4px);
    z-index: 200;
  `}
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;

export interface LoadingProps {
  size?: number;
  thickness?: number;
  label?: string;
  fullscreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 32,
  thickness = 3,
  label,
  fullscreen = false,
}) => (
  <Wrapper $fullscreen={fullscreen}>
    <Spinner $size={size} $thickness={thickness} />
    {label && <Label>{label}</Label>}
  </Wrapper>
);
