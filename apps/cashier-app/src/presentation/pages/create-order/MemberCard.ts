import styled from 'styled-components';

export const MemberCard = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid ${({ theme }) => theme.semantics.colors.accent.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .member-info {
    display: flex;
    flex-direction: column;
  }

  .member-name {
    font-weight: 600;
  }

  .member-sub-info {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .member-points {
    font-size: 0.75rem;
    font-weight: 600;
    background: ${({ theme }) => theme.semantics.colors.bg.main};
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }

  .remove-btn {
    background: none;
    border: none;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 1.25rem;
    cursor: pointer;
    padding: 4px;
    &:hover { color: ${({ theme }) => theme.semantics.colors.text.error}; }
  }
`;
