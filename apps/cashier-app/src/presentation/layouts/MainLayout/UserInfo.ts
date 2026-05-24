import styled from 'styled-components';

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;

  .avatar {
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.semantics.colors.bg.main};
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }

  .details {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 768px) {
      display: none;
    }

    .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: ${({ theme }) => theme.semantics.colors.text.primary};
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .role {
      font-size: 0.75rem;
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
      text-transform: capitalize;
    }
  }
`;
