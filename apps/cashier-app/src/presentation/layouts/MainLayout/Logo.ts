import styled from 'styled-components';

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: 0 0.5rem;

  .logo-icon {
    width: ${({ theme }) => theme.sizes.icon.avatar};
    height: ${({ theme }) => theme.sizes.icon.avatar};
    background: ${({ theme }) => theme.semantics.colors.accent.primary};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: ${({ theme }) => theme.shadows.accent};
    flex-shrink: 0;

    svg {
      width: ${({ theme }) => theme.sizes.icon.lg};
      height: ${({ theme }) => theme.sizes.icon.lg};
    }
  }

  .logo-text {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};

    @media (max-width: 768px) {
      display: none;
    }
  }
`;
