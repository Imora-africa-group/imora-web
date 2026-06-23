import type { Metadata } from 'next'
import Image from 'next/image'
import { prisma, getOptimizedUrl } from '@imora/db'
import { getTranslations } from 'next-intl/server'
import { ConstructionTabs } from './ConstructionTabs'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('construction')
  return {
    title: t('metaTitle'),
    description: "Du basique au luxe, nous réalisons votre projet de construction en Afrique selon vos besoins et votre budget.",
    openGraph: {
      title: `Construction — IMORA AFRICA`,
      description: "Construisez votre maison en Afrique avec IMORA AFRICA",
    },
  }
}

export default async function ConstructionPage() {
  const t = await getTranslations('construction')

  const standingLabels: Record<string, string> = {
    BASIQUE: t('standingBasique'),
    MOYEN: t('standingMoyen'),
    HAUT_STANDING: t('standingHaut'),
    LUXE: t('standingLuxe'),
  }

  const [modeles, realisations, settings] = await Promise.all([
    prisma.modeleConstruction.findMany({
      where: { status: 'PUBLISHED' },
      include: { images: { orderBy: { ordre: 'asc' } } },
      orderBy: { prixFCFA: 'asc' },
    }),
    prisma.realisation.findMany({
      where: { status: 'PUBLISHED' },
      include: { images: { orderBy: { ordre: 'asc' }, take: 1 } },
      orderBy: { annee: 'desc' },
      take: 4,
    }),
    prisma.settings.findUnique({ where: { id: 'singleton' } }),
  ])

  const rates = {
    usd: settings?.exchangeRateUSD ?? 0.00165,
    eur: settings?.exchangeRateEUR ?? 0.00152,
  }

  const modelesWithUrls = modeles.map((m) => {
    const mainImg = m.images.find((i) => i.isMain) ?? m.images[0]
    return {
      ...m,
      inclus: m.inclus as string[],
      optionsNonIncluses: m.optionsNonIncluses as string[],
      mainImageUrl: mainImg ? getOptimizedUrl(mainImg.cloudinaryPublicId, 600, 400) : null,
      usd: Math.round(m.prixFCFA * rates.usd),
      eur: Math.round(m.prixFCFA * rates.eur),
    }
  })

  const realisationsWithUrls = realisations.map((r) => ({
    ...r,
    imageUrl: r.images[0] ? getOptimizedUrl(r.images[0].cloudinaryPublicId, 400, 300) : null,
  }))

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 260, backgroundColor: '#0D2A4E' }}>
        <div className="absolute inset-0">
          <Image src="/demo/apart-6.png" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: 'rgba(13,42,78,0.78)' }} />
        </div>
        <div className="relative z-10 py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-serif text-white">{t('heroTitle')}</h1>
            <p className="mt-3 text-white/70 text-lg">{t('heroDesc')}</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <ConstructionTabs modeles={modelesWithUrls} standingLabels={standingLabels} />
        </div>
      </section>

      {/* Réalisations */}
      {realisationsWithUrls.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-serif font-bold text-center mb-10" style={{ color: '#0D2A4E' }}>
              {t('realisations')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {realisationsWithUrls.map((r) => (
                <div key={r.id} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  {r.imageUrl ? (
                    <Image src={r.imageUrl} alt={r.titre} fill className="object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-semibold leading-tight">{r.titre}</p>
                    <p className="text-white/70 text-xs mt-0.5">{r.zone} · {r.annee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
