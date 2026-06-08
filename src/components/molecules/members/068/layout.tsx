import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import localFont from 'next/font/local'
import './global.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

const rubikone = localFont({
  src: '../../../assets/fonts/rubik-one/RubikOne-Regular.ttf',
  variable: '--font-rubikone-local',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PLAYER 068 · LIGHTS OUT',
  description: 'Personal profile mini-game — spin the golden key 3 times to start the engine.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg',             type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${rubikone.variable} bg-background`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
