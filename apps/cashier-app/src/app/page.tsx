'use client'
import dynamic from 'next/dynamic'
import { StyledThemeProvider } from '../presentation/StyledThemeProvider'

const App = dynamic(() => import('../App'), { ssr: false })

export default function Page() {
  return (
    <StyledThemeProvider>
      <App />
    </StyledThemeProvider>
  )
}
