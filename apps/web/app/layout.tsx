import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { prisma } from '@imora/db'

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
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const waNumber = settings?.whatsappNumber ?? ''

  return (
    <html lang="fr" className={roboto.variable}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer settings={settings} />
        <WhatsAppButton phone={waNumber} />
      </body>
    </html>
  )
}
