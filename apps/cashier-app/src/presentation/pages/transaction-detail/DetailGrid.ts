import styled from 'styled-components';

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
