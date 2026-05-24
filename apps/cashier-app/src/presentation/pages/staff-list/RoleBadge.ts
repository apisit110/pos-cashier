import styled from 'styled-components';

export const RoleBadge = styled.span<{ $roleId: number }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $roleId }) => $roleId === 1 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  color: ${({ $roleId }) => $roleId === 1 ? '#818cf8' : '#4ade80'};
  border: 1px solid ${({ $roleId }) => $roleId === 1 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(34, 197, 94, 0.2)'};
`;
