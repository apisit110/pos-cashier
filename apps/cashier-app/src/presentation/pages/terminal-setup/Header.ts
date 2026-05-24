import styled from 'styled-components';

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
    background: linear-gradient(to right, #ffffff, #a5b4fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    font-size: 0.9375rem;
  }
`;
