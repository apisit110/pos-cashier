import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.xxl};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
`;
