import styled from 'styled-components';

export const BrandBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;
