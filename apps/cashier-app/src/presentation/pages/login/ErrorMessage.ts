import styled from 'styled-components';
import { shake } from './keyframes';

export const ErrorMessage = styled.div`
  background-color: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: ${({ theme }) => theme.semantics.colors.text.error};
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
  animation: ${shake} 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
`;
