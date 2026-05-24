import styled from 'styled-components';

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 0 0.5rem;

  .logo-icon {
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.semantics.colors.accent.primary};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: ${({ theme }) => theme.shadows.accent};

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    letter-spacing: -0.02em;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;
