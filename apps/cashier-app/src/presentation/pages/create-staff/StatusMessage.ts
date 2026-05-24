import styled from 'styled-components';
import { fadeIn } from './keyframes';

export const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease;
  background-color: ${({ $type }) => $type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $type }) => $type === 'success' ? '#16a34a' : '#dc2626'};
  border: 1px solid ${({ $type }) => $type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;
