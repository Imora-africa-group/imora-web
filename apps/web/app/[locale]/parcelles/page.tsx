import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { MapPin, MessageCircle } from 'lucide-react'
import { prisma, getOptimizedUrl, buildWhatsAppUrl, WA_MESSAGES } from '@imora/db'
import { getTranslations } from 'next-intl/server'
import { ParcellesFilters } from './ParcellesFilters'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('parcelles')
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    openGraph: {
      title: `Parcelles — IMORA AFRICA`,
      description: t('metaDesc'),
    },
  }
}

interface PageProps {
  searchParams: Promise<{
    ville?: string
    arrondissement?: string
    prixMin?: string
    prixMax?: string
    titreFoncier?: string
    venteNotariee?: string
    viabilisation?: string
  }>
}

export default async function ParcellesPage({ searchParams }: PageProps) {
  const t = await getTranslations('parcelles')
  const params = await searchParams

  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } }).catch(() => null)
  const rates = {
    usd: settings?.exchangeRateUSD ?? 0.00165,
    eur: settings?.exchangeRateEUR ?? 0.00152,
  }
  const waNumber = settings?.whatsappNumber ?? ''

  const prixFilter =
    params.prixMin && params.prixMax
      ? { gte: parseInt(params.prixMin), lte: parseInt(params.prixMax) }
      : params.prixMin
      ? { gte: parseInt(params.prixMin) }
      : params.prixMax
      ? { lte: parseInt(params.prixMax) }
      : undefined

  const where = {
    status: 'PUBLISHED' as const,
    ...(params.ville ? { ville: params.ville } : {}),
    ...(params.arrondissement ? { arrondissement: params.arrondissement } : {}),
    ...(prixFilter ? { prixFCFA: prixFilter } : {}),
    ...(params.titreFoncier === 'true' ? { titreFoncier: true } : {}),
    ...(params.venteNotariee === 'true' ? { venteNotariee: true } : {}),
    ...(params.viabilisation === 'true' ? { viabilisation: true } : {}),
  }

  const [parcelles, allParcelles] = await Promise.all([
    prisma.parcelle.findMany({
      where,
      include: { images: { orderBy: { ordre: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []),
    prisma.parcelle.findMany({
      where: { status: 'PUBLISHED' },
      select: { ville: true, arrondissement: true },
    }).catch(() => []),
  ])

  const villes = [...new Set(allParcelles.map((p) => p.ville))].sort()
  const arrondissements = params.ville
    ? [...new Set(allParcelles.filter((p) => p.ville === params.ville).map((p) => p.arrondissement))].sort()
    : []

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 260, backgroundColor: '#0D2A4E' }}>
        <div className="absolute inset-0">
          <Image src="/demo/apart-2.png" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: 'rgba(13,42,78,0.80)' }} />
        </div>
        <div className="relative z-10 py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-serif text-white">{t('heroTitle')}</h1>
            <p className="mt-3 text-white/70 text-lg">{t('heroDesc')}</p>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <ParcellesFilters
            villes={villes}
            arrondissements={arrondissements}
            currentParams={{
              ville: params.ville,
              arrondissement: params.arrondissement,
              prixMin: params.prixMin,
              prixMax: params.prixMax,
              titreFoncier: params.titreFoncier,
              venteNotariee: params.venteNotariee,
              viabilisation: params.viabilisation,
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          {parcelles.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-xl font-semibold text-gray-400">{t('noResult')}</p>
              <p className="mt-2 text-gray-400">{t('noResultHint')}</p>
              <Link
                href="/parcelles"
                className="mt-6 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('resetFilters')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
              {parcelles.map((p) => {
                const mainImg = p.images.find((i) => i.isMain) ?? p.images[0]
                const imgUrl = mainImg ? getOptimizedUrl(mainImg.cloudinaryPublicId, 600, 400) : null
                const usd = Math.round(p.prixFCFA * rates.usd)
                const eur = Math.round(p.prixFCFA * rates.eur)
                const waUrl = waNumber
                  ? buildWhatsAppUrl(waNumber, WA_MESSAGES.parcelle(p.titre))
                  : '#'

                return (
                  <div
                    key={p.id}
                    className="flex flex-col h-full bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative w-full h-[220px] bg-[#F2F4F7] flex-shrink-0 overflow-hidden">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={p.titre} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                            <MapPin className="w-7 h-7 text-[#9CA3AF]" />
                          </div>
                          <span className="text-xs text-[#9CA3AF]">{t('photoComingSoon')}</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 rounded-full px-2.5 py-1">
                        <MapPin size={12} style={{ color: '#C9A84C' }} />
                        <span className="text-xs font-medium text-gray-700">{p.ville}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{p.titre}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 truncate">
                          {p.arrondissement}, {p.ville}, {p.pays}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className="text-xl font-bold" style={{ color: '#0D2A4E' }}>
                          {p.prixFCFA.toLocaleString('fr-FR')}{' '}
                          <span className="text-base font-semibold">FCFA</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ${usd.toLocaleString('en')} · €{eur.toLocaleString('en')}
                        </p>
                      </div>

                      {(p.titreFoncier || p.venteNotariee || p.viabilisation) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.titreFoncier && (
                            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-medium"
                              style={{ borderColor: '#C9A84C', color: '#C9A84C', backgroundColor: '#FFFBEB' }}>
                              <span className="w-2 h-2 rounded-full border border-current inline-block" />
                              {t('titreFoncier')}
                            </span>
                          )}
                          {p.venteNotariee && (
                            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50 font-medium">
                              <span className="w-2 h-2 rounded-full border border-current inline-block" />
                              {t('venteNotariee')}
                            </span>
                          )}
                          {p.viabilisation && (
                            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border border-green-200 text-green-700 bg-green-50 font-medium">
                              <span className="w-2 h-2 rounded-full border border-current inline-block" />
                              {t('viabilise')}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto pt-4">
                        <Link
                          href={`/parcelles/${p.id}`}
                          className="flex-1 text-center rounded-full py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: '#C9A84C' }}
                        >
                          {t('interested')}
                        </Link>
                        {waNumber && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Contacter sur WhatsApp"
                            className="h-10 w-10 flex items-center justify-center rounded-full shrink-0 transition-opacity hover:opacity-90"
                            style={{ backgroundColor: '#25D366' }}
                          >
                            <MessageCircle size={18} className="text-white" fill="white" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
