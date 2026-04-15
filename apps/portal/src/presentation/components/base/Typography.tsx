import styled from 'styled-components'
import { tokens } from '../../styles/tokens'

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  font-family: ${tokens.typography.title.font};
  letter-spacing: -0.025em;
  margin: 0;
  background: linear-gradient(135deg, ${tokens.typography.title.color} 0%, ${tokens.typography.title.accent} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const Subtitle = styled.p`
  color: ${tokens.typography.subtitle.color};
  font-family: ${tokens.typography.subtitle.font};
  font-size: 1rem;
  margin: 0;
`

export const ErrorText = styled.div`
  padding: ${tokens.typography.error.padding};
  background-color: ${tokens.typography.error.background};
  border: 1px solid ${tokens.typography.error.border};
  border-radius: ${tokens.typography.error.borderRadius};
  color: ${tokens.typography.error.color};
  font-size: 0.875rem;
  text-align: center;
`
