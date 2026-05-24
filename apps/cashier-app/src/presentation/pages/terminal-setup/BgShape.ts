import styled from 'styled-components';
import { float } from './keyframes';

export const BgShape = styled.div<{
  $delay: string;
  $size: string;
  $color: string;
  $top?: string;
  $bottom?: string;
  $left?: string;
  $right?: string;
  $opacity?: number;
}>`
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
