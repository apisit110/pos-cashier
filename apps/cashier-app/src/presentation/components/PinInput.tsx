import React, { useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

const PinInputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

const PinDigitInput = styled.input<{ $isFilled?: boolean; $size?: string }>`
  width: ${({ $size }) => $size || '3.5rem'};
  height: ${({ $size }) => ($size ? `calc(${$size} * 1.15)` : '4rem')};
  text-align: center;
  font-size: ${({ $size }) => ($size ? `calc(${$size} * 0.4)` : '1.5rem')};
  font-weight: 700;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.default};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  ${({ $isFilled, theme }) => $isFilled && css`
    border-color: ${theme.semantics.colors.accent.primary};
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  boxSize?: string;
}

export const PinInput: React.FC<PinInputProps> = ({ 
  length = 6, 
  value, 
  onChange, 
  disabled,
  boxSize
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newValue = value.split('');
    newValue[index] = char;
    const finalValue = newValue.join('');
    
    onChange(finalValue);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length).replace(/\D/g, '');
    onChange(pastedData);
    
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <PinInputGroup>
      {Array.from({ length }).map((_, index) => (
        <PinDigitInput
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          $isFilled={!!value[index]}
          $size={boxSize}
          autoComplete="one-time-code"
        />
      ))}
    </PinInputGroup>
  );
};
