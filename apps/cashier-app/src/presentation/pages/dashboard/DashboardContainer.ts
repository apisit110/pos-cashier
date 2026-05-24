import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  padding: 2rem;
`;
