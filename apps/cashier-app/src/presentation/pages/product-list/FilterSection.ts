import styled from 'styled-components';

export const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
`;
