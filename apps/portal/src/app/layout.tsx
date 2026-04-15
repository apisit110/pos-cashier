import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import StyledComponentsRegistry from '@/lib/registry'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lightning Portal | Premium POS Experience',
  description: 'Manage your POS operations with speed and precision.',
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className='min-h-full font-inter'>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
