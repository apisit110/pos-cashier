import styled from 'styled-components';

export const UserProfile = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
