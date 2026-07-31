'use client'
import dynamic from 'next/dynamic'
import { StyledThemeProvider } from '../presentation/StyledThemeProvider'
import { LanguageProvider } from '../presentation/i18n/LanguageProvider'

const App = dynamic(() => import('../App'), { ssr: false })

export default function Page() {
  return (
    <StyledThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StyledThemeProvider>
  )
}
