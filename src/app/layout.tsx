import type { Metadata, Viewport } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import Cursor from '@/components/ui/Cursor'
import PerformanceGate from '@/components/providers/PerformanceGate'
import MotionProvider from '@/components/providers/MotionProvider'
import DebugPanel from '@/components/debug/DebugPanel'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap' })

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
        url: 'https://grit.cool/og.png', // Placeholder
        width: 1200,
        height: 630,
        alt: 'Grit Labs - Neo-futuristic Engineering',
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
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${cinzel.variable}`}>
      <body className="bg-background text-foreground antialiased selection:bg-neon-blue selection:text-black overflow-x-hidden">
        <PerformanceGate>
          <MotionProvider>
            <div className="film-grain"></div>
            <div className="vignette"></div>
            <Cursor />
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
            <DebugPanel />
          </MotionProvider>
        </PerformanceGate>
      </body>
    </html>
  )
}
