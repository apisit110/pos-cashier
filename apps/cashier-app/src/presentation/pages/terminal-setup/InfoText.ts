import styled from 'styled-components';

export const InfoText = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: 0.8125rem;
  text-align: center;
  opacity: 0.7;

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
    color: white;
  }
`;
