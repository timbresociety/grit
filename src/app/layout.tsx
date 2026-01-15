import type { Metadata, Viewport } from 'next'
import { DM_Sans, Cormorant_Garamond, Playfair_Display, Imperial_Script } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import ChapterNav from '@/components/ui/ChapterNav'
import PerformanceGate from '@/components/providers/PerformanceGate'
import MotionProvider from '@/components/providers/MotionProvider'
import { HeroLoadingProvider } from '@/contexts/HeroLoadingContext'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900']
})

const imperialScript = Imperial_Script({
  subsets: ['latin'],
  variable: '--font-imperial',
  display: 'swap',
  weight: ['400']
})

export const metadata: Metadata = {
  title: 'Grit Labs | Enterprise AI & Blockchain Engineering',
  description: 'Grit Labs builds bespoke AI agents and blockchain infrastructure for enterprise scale. Precision engineered by senior operators.',
  keywords: ['AI Agents', 'Blockchain Engineering', 'Web3', 'Enterprise AI', 'RWA Tokenization'],
  openGraph: {
    title: 'Grit Labs | Precision Engineering',
    description: 'Bespoke AI + Blockchain infrastructure. Built by senior operators for enterprise scale.',
    url: 'https://grit.cool',
    siteName: 'Grit Labs',
    images: [
      {
        url: 'https://grit.cool/og.png',
        width: 1200,
        height: 630,
        alt: 'Grit Labs - Precision Engineering',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grit Labs',
    description: 'Enterprise AI & Blockchain Engineering.',
    creator: '@gritlabsinit',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF9F7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${playfair.variable} ${imperialScript.variable}`}>
      <body className="bg-background text-foreground antialiased overflow-x-hidden">
        <PerformanceGate>
          <MotionProvider>
            <HeroLoadingProvider>
              <Navbar />
              <main className="relative">
                {children}
              </main>
            </HeroLoadingProvider>
          </MotionProvider>
        </PerformanceGate>
      </body>
    </html>
  )
}
