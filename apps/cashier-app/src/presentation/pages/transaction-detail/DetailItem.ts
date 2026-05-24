import styled from 'styled-components';

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  span {
    font-size: 1.125rem;
    font-weight: 500;
  }

  .amount {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }
`;
