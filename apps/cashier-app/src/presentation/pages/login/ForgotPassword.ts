import styled from 'styled-components';

export const ForgotPassword = styled.a`
  color: ${({ theme }) => theme.semantics.colors.accent.primary};
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #a5b4fc;
  }
`;
