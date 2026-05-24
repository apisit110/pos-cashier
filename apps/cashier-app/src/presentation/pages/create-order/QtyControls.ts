import styled from 'styled-components';

export const QtyControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;

  .qty-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    background: rgba(255, 255, 255, 0.03);
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${({ theme }) => theme.semantics.colors.accent.primary};
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      color: white;
    }
  }

  .qty-val {
    min-width: 20px;
    text-align: center;
    font-weight: 600;
  }
`;
