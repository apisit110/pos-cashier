import styled from 'styled-components';

export const BrandLogo = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.semantics.colors.accent.primary}, #22d3ee);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.accent};

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;
