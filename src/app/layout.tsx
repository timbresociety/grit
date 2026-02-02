import type { Metadata, Viewport } from 'next'
import { DM_Sans, Cormorant_Garamond, Playfair_Display, Imperial_Script, Instrument_Serif } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import ChapterNav from '@/components/ui/ChapterNav'
import PerformanceGate from '@/components/providers/PerformanceGate'
import MotionProvider from '@/components/providers/MotionProvider'
import { HeroLoadingProvider } from '@/contexts/HeroLoadingContext'
import PageLoader from '@/components/ui/PageLoader'
import CustomCursor from '@/components/ui/CustomCursor'

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

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic']
})

const ppMondwest = localFont({
  src: '../../public/fonts/PPMondwest-Regular.otf',
  variable: '--font-pp-mondwest',
  display: 'swap'
})

const ppNeueBit = localFont({
  src: '../../public/fonts/PPNeueBit-Bold.otf',
  variable: '--font-pp-neuebit',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'GRIT Labs | Engineered to Endure',
  description: 'We build bespoke AI and Blockchain software for teams that think long term. Enterprise grade. Operator led.',
  keywords: ['AI Agents', 'Blockchain Engineering', 'Web3', 'Enterprise AI', 'RWA Tokenization', 'Bespoke Software'],
  openGraph: {
    title: 'GRIT Labs | Engineered to Endure',
    description: 'We build bespoke AI and Blockchain software for teams that think long term. Enterprise grade. Operator led.',
    url: 'https://grit.cool',
    siteName: 'GRIT Labs',
    images: [
      {
        url: 'https://grit.cool/og.png',
        width: 1200,
        height: 630,
        alt: 'GRIT Labs - Engineered to Endure',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GRIT Labs | Engineered to Endure',
    description: 'We build bespoke AI and Blockchain software for teams that think long term. Enterprise grade. Operator led.',
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
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${playfair.variable} ${imperialScript.variable} ${instrumentSerif.variable} ${ppMondwest.variable} ${ppNeueBit.variable}`}>
      <body className="bg-background text-foreground antialiased overflow-x-hidden">
        <CustomCursor />
        <PerformanceGate>
          <MotionProvider>
            <HeroLoadingProvider>
              <PageLoader />
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
