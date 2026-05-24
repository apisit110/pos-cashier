import styled from 'styled-components';

export const ClearButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;
  height: 38px;

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }
`;
