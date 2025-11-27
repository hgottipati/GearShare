import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import MobileBottomNav from '@/components/MobileBottomNav'

export const metadata: Metadata = {
  title: 'GearShare - Private Marketplace',
  description: 'Private marketplace for gear trading',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
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

