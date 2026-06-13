import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.15s ease;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  max-width: 440px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${slideIn} 0.2s ease;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.semantics.colors.text.primary};
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' }>`
  width: 100%;
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: all 0.15s;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.components.button.primary.bg};
          color: ${theme.components.button.primary.text};
          &:hover { background: ${theme.components.button.primary.hover}; }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.semantics.colors.text.secondary};
          &:hover { background: ${theme.semantics.colors.accent.subtleBgHover}; }
        `;
      default:
        return `
          background: transparent;
          color: ${theme.semantics.colors.text.secondary};
          border: 1px solid ${theme.semantics.colors.border.subtle};
          &:hover { background: ${theme.semantics.colors.accent.subtleBgHover}; }
        `;
    }
  }}
`;

const ProgressBar = styled.div<{ $duration: number }>`
  height: 3px;
  background: ${({ theme }) => theme.components.button.primary.bg};
  border-radius: 2px;
  margin-bottom: 1.25rem;
  animation: shrink ${({ $duration }) => $duration}s linear forwards;

  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

export interface AlertDialogButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface AlertDialogProps {
  open: boolean;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  buttons?: [AlertDialogButton?, AlertDialogButton?, AlertDialogButton?];
  autoCloseSeconds?: number;
  closeOnOverlayClick?: boolean;
  onClose?: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  icon,
  title,
  description,
  buttons = [],
  autoCloseSeconds,
  closeOnOverlayClick = false,
  onClose,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open || !autoCloseSeconds || !onClose) return;
    timerRef.current = setTimeout(onClose, autoCloseSeconds * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, autoCloseSeconds, onClose]);

  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick && onClose) onClose();
  };

  const definedButtons = buttons.filter(Boolean) as AlertDialogButton[];

  return (
    <Overlay onClick={handleOverlayClick}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        {autoCloseSeconds && <ProgressBar $duration={autoCloseSeconds} />}

        {icon && <IconWrapper>{icon}</IconWrapper>}

        <Header>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </Header>

        {definedButtons.length > 0 && (
          <Actions>
            {definedButtons.map((btn, i) => (
              <Button key={i} $variant={btn.variant ?? (i === 0 ? 'primary' : 'secondary')} onClick={btn.onClick}>
                {btn.label}
              </Button>
            ))}
          </Actions>
        )}
      </Dialog>
    </Overlay>
  );
};
