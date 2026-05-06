import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StyledThemeProvider } from './presentation/StyledThemeProvider'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledThemeProvider>
      <App />
    </StyledThemeProvider>
  </StrictMode>,
)
