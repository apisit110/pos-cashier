import styled from 'styled-components';

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $status }) => $status.toLowerCase() === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $status }) => $status.toLowerCase() === 'success' ? '#22c55e' : '#ef4444'};
  border: 1px solid ${({ $status }) => $status.toLowerCase() === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;
