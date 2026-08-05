import styled from 'styled-components';

export const OrderSummary = styled.div`
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .summary-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};

    &.total {
      font-size: 1.75rem;
      font-weight: 700;
      color: ${({ theme }) => theme.semantics.colors.accent.primary};
      border-top: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
      padding-top: 0.75rem;
      margin-top: 0.25rem;
    }
  }

  .shortcut-hint {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    text-align: center;
    margin-top: 0.5rem;
    opacity: 0.9;
    font-weight: 500;
    kbd {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: inherit;
      color: ${({ theme }) => theme.semantics.colors.text.primary};
    }
  }
`;
