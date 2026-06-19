import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { prisma } from '@imora/db'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
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
    <html lang="fr" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer settings={settings} />
        <WhatsAppButton phone={waNumber} />
      </body>
    </html>
  )
}
