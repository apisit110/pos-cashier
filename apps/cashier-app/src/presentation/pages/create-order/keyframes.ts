import { keyframes } from 'styled-components';

export const rowIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); background: rgba(16, 185, 129, 0.1); }
  to { opacity: 1; transform: translateX(0); background: transparent; }
`;
