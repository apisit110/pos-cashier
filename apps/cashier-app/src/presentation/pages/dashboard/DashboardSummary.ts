import styled from 'styled-components';

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.25rem 1.5rem;
`;

export const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  margin-bottom: 0.375rem;
`;

export const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.semantics.colors.text.primary};
`;

export const ChartSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.5rem;
`;

export const ChartTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  margin: 0 0 1.25rem 0;
`;

export const ChartCanvas = styled.div`
  position: relative;
  height: 220px;
`;

export const EmptyState = styled.div`
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: 0.875rem;
  text-align: center;
  padding: 2rem 0;
`;
