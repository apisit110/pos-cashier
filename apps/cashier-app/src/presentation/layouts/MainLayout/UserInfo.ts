import styled from 'styled-components';

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;

  .avatar {
    width: ${({ theme }) => theme.sizes.icon.avatar};
    height: ${({ theme }) => theme.sizes.icon.avatar};
    background: ${({ theme }) => theme.semantics.colors.bg.main};
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
    flex-shrink: 0;
  }

  .details {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 768px) {
      display: none;
    }

    .name {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      color: ${({ theme }) => theme.semantics.colors.text.primary};
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .role {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
      text-transform: capitalize;
    }
  }
`;
