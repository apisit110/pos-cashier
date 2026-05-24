import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
`;
