import styled from 'styled-components';

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input, select {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: 8px;
    padding: 0.6rem;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      background: rgba(255, 255, 255, 0.05);
    }

    &::placeholder {
      color: ${({ theme }) => theme.semantics.colors.text.disabled};
    }
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
  }
`;
