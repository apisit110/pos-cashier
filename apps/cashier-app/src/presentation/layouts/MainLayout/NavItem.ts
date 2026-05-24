import styled from 'styled-components';

interface NavItemProps {
  $active?: boolean;
}

export const NavItem = styled.button<NavItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0.875rem ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: none;
  background: ${({ theme, $active }) =>
    $active ? theme.components.navItem.activeBg : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.components.navItem.activeColor : theme.components.navItem.defaultColor};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.components.navItem.hoverBg};
    color: ${({ theme }) => theme.components.navItem.hoverColor};
  }

  svg {
    width: ${({ theme }) => theme.sizes.icon.md};
    height: ${({ theme }) => theme.sizes.icon.md};
    flex-shrink: 0;
  }

  .nav-label {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;
