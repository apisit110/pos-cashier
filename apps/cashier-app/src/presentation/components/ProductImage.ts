import styled from 'styled-components';

export const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.03);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;
