import styled from 'styled-components';

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  input {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 0.625rem 1rem;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.semantics.colors.accent.primary}20;
      background: rgba(15, 23, 42, 0.8);
    }

    &::placeholder {
      color: ${({ theme }) => theme.semantics.colors.text.secondary}80;
    }
  }
`;
