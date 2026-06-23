import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404' }

export default async function NotFound() {
  const t = await getTranslations('notFound')
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-serif font-bold" style={{ color: '#C9A84C' }}>404</p>
      <h1 className="mt-4 text-3xl font-serif font-bold" style={{ color: '#0D2A4E' }}>
        {t('title')}
      </h1>
      <p className="mt-3 text-gray-500 max-w-md">{t('desc')}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#0D2A4E' }}
      >
        {t('back')}
      </Link>
    </div>
  )
}
