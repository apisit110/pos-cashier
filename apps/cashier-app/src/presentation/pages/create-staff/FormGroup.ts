import styled from 'styled-components';

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  input[type="text"] {
    padding: 0.75rem 1rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    outline: none;
    transition: ${({ theme }) => theme.transitions.default};

    &:focus {
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      background: rgba(15, 23, 42, 0.8);
    }
  }
`;
