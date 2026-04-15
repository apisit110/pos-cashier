import styled from 'styled-components'
import { tokens } from '../../styles/tokens'

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.input.gap};
  width: 100%;
`

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${tokens.input.color};
  opacity: 0.8;
`

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  background: ${tokens.input.background};
  border: 1px solid ${tokens.input.border};
  border-radius: ${tokens.input.borderRadius};
  color: ${tokens.input.color};
  font-size: 1rem;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: ${tokens.input.focus.border};
    background: ${tokens.input.focus.background};
    box-shadow: ${tokens.input.focus.shadow};
  }

  &::placeholder {
    color: ${tokens.input.placeholder};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  color: ${tokens.input.placeholder};
  display: flex;
  align-items: center;
  justify-content: center;
`
