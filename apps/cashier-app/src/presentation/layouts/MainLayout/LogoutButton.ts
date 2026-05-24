import styled from 'styled-components';

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  background: transparent;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0.75rem;

    .label {
      display: none;
    }
  }
`;
