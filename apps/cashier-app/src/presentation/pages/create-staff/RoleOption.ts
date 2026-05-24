import styled, { css } from 'styled-components';

export const RoleOption = styled.label<{ $selected?: boolean }>`
  cursor: pointer;

  input { display: none; }

  .role-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: ${({ theme }) => theme.transitions.default};

    .role-icon { font-size: 1.5rem; }

    .role-info {
      display: flex;
      flex-direction: column;
      .role-name { font-weight: 600; }
      .role-desc { font-size: 0.75rem; color: ${({ theme }) => theme.semantics.colors.text.secondary}; }
    }
  }

  ${({ $selected, theme }) => $selected && css`
    .role-card {
      background: rgba(99, 102, 241, 0.1);
      border-color: ${theme.semantics.colors.accent.primary};
    }
  `}

  &:hover .role-card {
    border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }
`;
