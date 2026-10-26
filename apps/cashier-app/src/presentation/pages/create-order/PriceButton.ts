import styled from 'styled-components';

export const PriceButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  margin: -0.25rem -0.5rem;
  border-radius: 6px;
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.semantics.colors.accent.subtleBgHover};
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }
`;
