import { keyframes } from 'styled-components';

export const scanSuccess = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { transform: scale(1); }
`;

export const rowIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); background: rgba(16, 185, 129, 0.1); }
  to { opacity: 1; transform: translateX(0); background: transparent; }
`;
