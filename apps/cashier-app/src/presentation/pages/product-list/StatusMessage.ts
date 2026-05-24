import styled from 'styled-components';

export const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  margin-bottom: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  font-size: 0.875rem;
  background-color: ${({ $type }) => $type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $type }) => $type === 'success' ? '#16a34a' : '#dc2626'};
  border: 1px solid ${({ $type }) => $type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;
