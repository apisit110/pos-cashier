import styled from 'styled-components';

export const StaffIdGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  input { flex: 1; }

  .regenerate-button {
    background: ${({ theme }) => theme.semantics.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    padding: 0 0.75rem;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      color: ${({ theme }) => theme.semantics.colors.text.primary};
    }

    svg { width: 18px; height: 18px; }
  }
`;
