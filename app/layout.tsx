import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import MobileBottomNav from '@/components/MobileBottomNav'

export const metadata: Metadata = {
  title: 'ShareMyGear - Private Marketplace',
  description: 'Private marketplace for gear trading',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  )
}

