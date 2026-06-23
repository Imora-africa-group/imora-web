import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Check } from 'lucide-react'
import { prisma } from '@imora/db'
import { getTranslations } from 'next-intl/server'
import { LoyersTable } from './LoyersTable'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('gestionLocative')
  return {
    title: t('metaTitle'),
    description: "Confiez-nous la gestion de votre bien immobilier. Percevez vos loyers chaque mois sans tracas.",
  }
}

export default async function GestionLocativePage() {
  const t = await getTranslations('gestionLocative')

  const ceQueNousGerons = [
    t('item1'), t('item2'), t('item3'),
    t('item4'), t('item5'), t('item6'),
  ]

  const avantages = [
    { titre: t('adv1Title'), detail: t('adv1Detail') },
    { titre: t('adv2Title'), detail: t('adv2Detail') },
    { titre: t('adv3Title'), detail: t('adv3Detail') },
    { titre: t('adv4Title'), detail: t('adv4Detail') },
  ]

  const [loyers, settings] = await Promise.all([
    prisma.loyer.findMany({ orderBy: [{ ville: 'asc' }, { standing: 'asc' }, { nbPieces: 'asc' }] }),
    prisma.settings.findUnique({ where: { id: 'singleton' } }),
  ])

  const rates = {
    usd: settings?.exchangeRateUSD ?? 0.00165,
    eur: settings?.exchangeRateEUR ?? 0.00152,
  }

  const loyersWithRates = loyers.map((l) => ({
    ...l,
    minUsd: Math.round(l.loyerMinFCFA * rates.usd),
    minEur: Math.round(l.loyerMinFCFA * rates.eur),
    maxUsd: Math.round(l.loyerMaxFCFA * rates.usd),
    maxEur: Math.round(l.loyerMaxFCFA * rates.eur),
  }))

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 260, backgroundColor: '#0D2A4E' }}>
        <div className="absolute inset-0">
          <Image src="/demo/apart-3.png" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: 'rgba(13,42,78,0.82)' }} />
        </div>
        <div className="relative z-10 py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-serif text-white">{t('heroTitle')}</h1>
            <p className="mt-3 text-white/70 text-lg">{t('heroDesc')}</p>
          </div>
        </div>
      </section>

      {/* Ce que nous gérons */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
            {t('weManage')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ceQueNousGerons.map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FFFBEB' }}>
                  <Check size={16} style={{ color: '#C9A84C' }} />
                </div>
                <span className="text-sm text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vos avantages */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
            {t('advantages')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {avantages.map((a) => (
              <div key={a.titre} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Check size={18} style={{ color: '#C9A84C' }} />
                  <h3 className="font-semibold text-gray-900">{a.titre}</h3>
                </div>
                <p className="text-sm text-gray-500 ml-7">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyers de référence */}
      {loyersWithRates.length > 0 && (
        <section className="py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
              {t('referenceRents')}
            </h2>
            <LoyersTable loyers={loyersWithRates} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ backgroundColor: '#0D2A4E' }} className="py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-white">{t('ctaTitle')}</h2>
          <p className="mt-3 text-white/70">{t('ctaDesc')}</p>
          <div className="mt-8">
            <Link
              href="/simulation"
              className="inline-flex items-center rounded-full px-8 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9A84C' }}
            >
              {t('ctaBtn')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
