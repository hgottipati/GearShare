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
  title: 'Ski Lessons for Kids - Summit at Snoqualmie',
  description: 'Personalized ski lessons for kids ages 6-15. Structured 4-week programs and flexible one-time lessons focused on fun, safety, and steady progression.',
  keywords: ['ski lessons', 'kids ski lessons', 'ski instruction', 'Summit at Snoqualmie', 'ski school', 'children skiing', 'ski gear marketplace'],
  authors: [{ name: 'Ski Lessons' }],
  creator: 'Ski Lessons',
  publisher: 'Ski Lessons',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Ski Lessons',
    title: 'Ski Lessons for Kids - Summit at Snoqualmie',
    description: 'Personalized ski lessons for kids ages 6-15. Structured 4-week programs and flexible one-time lessons focused on fun, safety, and steady progression.',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Ski Lessons for Kids - Summit at Snoqualmie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ski Lessons for Kids - Summit at Snoqualmie',
    description: 'Personalized ski lessons for kids ages 6-15. Structured 4-week programs and flexible one-time lessons focused on fun, safety, and steady progression.',
    images: [`${APP_URL}/og-image.png`],
    creator: '@skilessons', // Update with your Twitter handle if you have one
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

