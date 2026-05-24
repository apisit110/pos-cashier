import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  padding: 2rem;

  .total-count {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }
`;
