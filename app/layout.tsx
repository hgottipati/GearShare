import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import MobileBottomNav from '@/components/MobileBottomNav'

// Get the app URL from environment variables or use a default
const getAppUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'https://sharemygear.com' // Update with your actual domain
}

const APP_URL = getAppUrl()

export const metadata: Metadata = {
  title: 'ShareMyGear - Private Marketplace',
  description: 'Buy, sell, and trade kids\' ski gear with your community. Safe, approved access for ski families.',
  keywords: ['ski gear', 'kids ski equipment', 'gear marketplace', 'ski community', 'gear trading'],
  authors: [{ name: 'ShareMyGear' }],
  creator: 'ShareMyGear',
  publisher: 'ShareMyGear',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'ShareMyGear',
    title: 'ShareMyGear - Private Ski Gear Marketplace',
    description: 'Buy, sell, and trade kids\' ski gear with your community. Safe, approved access for ski families.',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ShareMyGear - Private Ski Gear Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShareMyGear - Private Ski Gear Marketplace',
    description: 'Buy, sell, and trade kids\' ski gear with your community. Safe, approved access for ski families.',
    images: [`${APP_URL}/og-image.png`],
    creator: '@sharemygear', // Update with your Twitter handle if you have one
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
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

