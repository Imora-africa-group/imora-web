import type { Metadata } from 'next'
import './globals.css'
import { Geist } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper'
import { Toaster } from 'sonner'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'IMORA AFRICA — Admin',
  description: 'Dashboard administrateur IMORA AFRICA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={cn('font-sans', geist.variable)}>
      <body>
        <SessionProviderWrapper>
          {children}
          <Toaster richColors position="top-right" />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
