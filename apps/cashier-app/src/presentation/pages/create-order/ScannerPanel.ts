import styled from 'styled-components';

export const ScannerPanel = styled.aside`
  width: 320px;
  border-right: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: linear-gradient(to bottom, ${({ theme }) => theme.semantics.colors.bg.main} 0%, rgba(99, 102, 241, 0.05) 100%);
  overflow-y: auto;

  h3 {
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 0.75rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
  }
`;
