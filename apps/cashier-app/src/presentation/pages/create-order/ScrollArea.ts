import styled from 'styled-components';

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0 1.5rem 2rem;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: 10px;
    &:hover { background: ${({ theme }) => theme.semantics.colors.text.secondary}; }
  }
`;
