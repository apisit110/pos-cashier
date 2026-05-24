import styled from 'styled-components';

export const LoginFooter = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};

  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.semantics.colors.accent.primary};
    }
  }
`;
