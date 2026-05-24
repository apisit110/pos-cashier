import styled from 'styled-components';
import { slideUpFade } from './keyframes';

export const LoginCard = styled.div`
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
