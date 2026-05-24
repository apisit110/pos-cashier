import styled from 'styled-components';

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  background: transparent;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.components.logoutButton.hoverBorder};
    color: ${({ theme }) => theme.components.logoutButton.hoverColor};
    background: ${({ theme }) => theme.components.logoutButton.hoverBg};
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0.75rem;

    .label {
      display: none;
    }
  }
`;
