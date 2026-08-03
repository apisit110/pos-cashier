import styled from 'styled-components';

export const DashboardHeader = styled.header`
  margin-bottom: 2rem;
`;

export const DashboardTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  margin: 0;
`;

export const DashboardSubtitle = styled.p`
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  margin-top: 0.5rem;
`;
