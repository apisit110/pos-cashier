import styled from 'styled-components';

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  margin: auto;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.semantics.colors.border.subtle};
    margin-bottom: 1rem;
  }
`;
