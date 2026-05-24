import styled from 'styled-components';

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $status }) => $status.toLowerCase() === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $status }) => $status.toLowerCase() === 'success' ? '#22c55e' : '#ef4444'};
`;
