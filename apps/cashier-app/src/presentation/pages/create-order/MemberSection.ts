import styled from 'styled-components';

export const MemberSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
`;
