import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { prisma } from '@imora/db'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'fr' | 'en')) notFound()

  const [messages, settings] = await Promise.all([
    getMessages(),
    prisma.settings.findUnique({ where: { id: 'singleton' } }),
  ])

  const waNumber = settings?.whatsappNumber ?? ''

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phone={waNumber} />
    </NextIntlClientProvider>
  )
}
