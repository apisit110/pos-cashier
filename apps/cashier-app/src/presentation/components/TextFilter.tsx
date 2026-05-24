import React from 'react';
import styled from 'styled-components';

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
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
`;

interface TextFilterProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextFilter: React.FC<TextFilterProps> = ({ label, placeholder, value, onChange }) => (
  <Group>
    <Label>{label}</Label>
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </Group>
);
