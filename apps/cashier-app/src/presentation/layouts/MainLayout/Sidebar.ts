import styled from 'styled-components';

export const Sidebar = styled.aside`
  width: 280px;
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border-right: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;

  @media (max-width: 768px) {
    width: 80px;
    padding: 1.5rem 1rem;
  }
`;
