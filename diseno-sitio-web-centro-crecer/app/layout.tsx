import { Analytics } from '@vercel/analytics/next'
import { Montserrat, Poppins } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const heading = Poppins({ subsets: ['latin'], weight: ['700'], variable: '--font-heading' })
const body = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Centro Crecer | Una comunidad que acompaña y transforma',
  description: 'Apoyo escolar, deporte, cultura y formación para vecinos de Buenos Aires.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
