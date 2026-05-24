import styled, { css } from 'styled-components';

export type BadgeVariant = 'success' | 'error' | 'info';
export type BadgeShape = 'square' | 'pill';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  $variant: BadgeVariant;
  $shape?: BadgeShape;
  $size?: BadgeSize;
}

export const Badge = styled.span<BadgeProps>`
  display: inline-block;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;

  font-size: ${({ $size = 'sm' }) => $size === 'sm' ? '0.75rem' : '0.875rem'};

  ${({ $shape = 'square' }) => $shape === 'pill' ? css`
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  ` : css`
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  `}

  ${({ $variant, $shape = 'square', theme }) => {
    const s = theme.semantics.colors.status[$variant];
    return css`
      color: ${s.text};
      background: ${s.softBg};
      ${$shape === 'pill' ? `border: 1px solid ${s.softBorder};` : ''}
    `;
  }}
`;
