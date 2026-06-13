import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.semantics.colors.text.primary};
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: all 0.15s;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
        background: ${theme.components.button.primary.bg};
        color: ${theme.components.button.primary.text};
        &:hover { background: ${theme.components.button.primary.hover}; }
      `
      : `
        background: transparent;
        color: ${theme.semantics.colors.text.secondary};
        border: 1px solid ${theme.semantics.colors.border.subtle};
        &:hover { background: ${theme.semantics.colors.accent.subtleBgHover}; }
      `}
`;

export interface AlertDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <Overlay onClick={onCancel}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <Actions>
          <Button $variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button $variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
        </Actions>
      </Dialog>
    </Overlay>
  );
};
