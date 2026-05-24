import styled from 'styled-components';

interface NavItemProps {
  $active?: boolean;
}

export const NavItem = styled.button<NavItemProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: none;
  background: ${({ $active }) => $active ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.semantics.colors.accent.primary : theme.semantics.colors.text.secondary};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;
  text-align: left;

  &:hover {
    background: rgba(99, 102, 241, 0.05);
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }

  svg {
    width: 22px;
    height: 22px;
  }

  .nav-label {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;
