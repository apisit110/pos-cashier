import styled from 'styled-components';

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;
