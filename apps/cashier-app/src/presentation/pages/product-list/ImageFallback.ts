import styled from 'styled-components';

export const ImageFallback = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: 1rem;
  font-weight: 700;
  border: 1px dashed ${({ theme }) => theme.semantics.colors.border.subtle};
`;
