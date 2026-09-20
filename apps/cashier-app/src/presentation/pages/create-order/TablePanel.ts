import styled from 'styled-components';
import { rowIn } from './keyframes';

export const TablePanel = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.semantics.colors.bg.main};
  overflow: hidden;
  min-height: 0;

  .table-header {
    padding: 1.5rem 1.5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .item-count {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.semantics.colors.text.secondary};
    }
  }

  .table-error {
    margin: 0 1.5rem 1rem;
    padding: 0.5rem 0.75rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: rgba(239, 68, 68, 0.1);
    color: ${({ theme }) => theme.semantics.colors.status.error};
    font-size: 0.875rem;
  }

  tr.new-item {
    animation: ${rowIn} 0.5s ease-out;
  }
`;
