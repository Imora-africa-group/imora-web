import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imoraafricagroup.com'),
  title: { template: 'IMORA AFRICA | %s', default: 'IMORA AFRICA' },
  description: "L'immobilier sécurisé, sans tracasserie",
  openGraph: {
    siteName: 'IMORA AFRICA',
    images: ['/og-image.jpg'],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={roboto.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
