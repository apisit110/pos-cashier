import styled from 'styled-components';

export const Sidebar = styled.aside`
  width: ${({ theme }) => theme.sizes.sidebar.expanded};
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border-right: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;

  @media (max-width: 768px) {
    width: ${({ theme }) => theme.sizes.sidebar.collapsed};
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;
