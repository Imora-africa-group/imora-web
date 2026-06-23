import type { Metadata } from 'next'
import './globals.css'
import { Geist } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper'
import { Toaster } from 'sonner'
import { getLocale } from 'next-intl/server'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'IMORA AFRICA — Admin',
  description: 'Dashboard administrateur IMORA AFRICA',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={cn('font-sans', geist.variable)}>
      <body>
        <SessionProviderWrapper>
          {children}
          <Toaster richColors position="top-right" />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
