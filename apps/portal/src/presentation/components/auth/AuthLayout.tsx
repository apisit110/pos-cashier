import styled, { keyframes } from 'styled-components'
import { tokens } from '../../styles/tokens'

const pulse = keyframes`
  from { transform: scale(1); opacity: 0.05; }
  to { transform: scale(1.2); opacity: 0.15; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`

export const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: ${tokens.authLayout.background};
  color: ${tokens.authLayout.foreground};
  font-family: ${tokens.authLayout.fontBody};
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const AuthLeft = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${tokens.authLayout.padding};
  background: radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 90% 90%, rgba(139, 92, 246, 0.05) 0%, transparent 40%);
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.02;
    pointer-events: none;
  }
`

export const AuthRight = styled.section`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${tokens.authLayout.brandSurface};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle at center, ${tokens.authLayout.brandAccent} 0%, transparent 70%);
    opacity: 0.1;
    animation: ${pulse} 8s infinite alternate;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const AuthCard = styled.main`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: ${tokens.card.gap};
  padding: ${tokens.card.padding};
  background: ${tokens.card.background};
  backdrop-filter: blur(10px);
  border: 1px solid ${tokens.card.border};
  border-radius: ${tokens.card.borderRadius};
`

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.authLayout.padding};
  z-index: 2;
  text-align: center;
`

export const StyledLogoImage = styled.div`
  img {
    filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.4));
    animation: ${float} 6s ease-in-out infinite;
  }
`

export const LogoText = styled.div`
  font-family: ${tokens.authLayout.fontHeading};
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: white;
  text-transform: uppercase;
`
