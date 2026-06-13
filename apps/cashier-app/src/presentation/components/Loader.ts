import styled from 'styled-components';
import { spin } from './keyframes';

export const Loader = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  display: inline-block;
  margin-right: 0.75rem;
  vertical-align: middle;
`;
