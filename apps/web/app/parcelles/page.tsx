import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, MessageCircle } from 'lucide-react'
import { prisma, getOptimizedUrl, buildWhatsAppUrl, WA_MESSAGES } from '@imora/db'
import { ParcellesFilters } from './ParcellesFilters'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Parcelles Disponibles',
  description: "Découvrez nos terrains avec Titre Foncier, vérifiés et prêts à bâtir dans toute l'Afrique de l'Ouest.",
  openGraph: {
    title: 'Parcelles — IMORA AFRICA',
    description: "Des terrains sécurisés disponibles en Afrique de l'Ouest",
  },
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
  const params = await searchParams

  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
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
    }),
    prisma.parcelle.findMany({
      where: { status: 'PUBLISHED' },
      select: { ville: true, arrondissement: true },
    }),
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
            <h1 className="text-4xl md:text-5xl font-serif text-white">Nos Parcelles Disponibles</h1>
            <p className="mt-3 text-white/70 text-lg">
              Découvrez nos terrains avec Titre Foncier, vérifiés et prêts à bâtir dans toute l&apos;Afrique de l&apos;Ouest.
            </p>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <ParcellesFilters
            villes={villes}
            arrondissements={arrondissements}
            currentParams={params}
          />
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 px-4 bg-gray-50 min-h-[60vh]">
        <div className="mx-auto max-w-7xl">
          {parcelles.length === 0 ? (
            <div className="text-center py-24">
              <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl font-semibold text-gray-500">Aucune parcelle trouvée</p>
              <p className="text-gray-400 mt-2">Essayez d&apos;ajuster vos filtres</p>
              <Link
                href="/parcelles"
                className="mt-6 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: '#C9A84C' }}
              >
                Réinitialiser les filtres
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parcelles.map((p, idx) => {
                const mainImg = p.images.find((i) => i.isMain) ?? p.images[0]
                const imgUrl = mainImg
                  ? getOptimizedUrl(mainImg.cloudinaryPublicId, 600, 400)
                  : `/demo/apart-${(idx % 12) + 1}.png`
                const usd = Math.round(p.prixFCFA * rates.usd)
                const eur = Math.round(p.prixFCFA * rates.eur)
                const waMsg = WA_MESSAGES.parcelle(p.titre)
                const waUrl = waNumber ? buildWhatsAppUrl(waNumber, waMsg) : '#'

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  >
                    {/* Image + badges overlay */}
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      <Image
                        src={imgUrl}
                        alt={p.titre}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />

                      {/* Badges sur l'image */}
                      {(p.titreFoncier || p.venteNotariee) && (
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {p.titreFoncier && (
                            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm">
                              <span className="w-3 h-3 rounded-full border-2 border-gray-700 shrink-0 inline-block" />
                              Titre Foncier
                            </span>
                          )}
                          {p.venteNotariee && (
                            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm">
                              <span className="w-3 h-3 rounded-full border-2 border-gray-700 shrink-0 inline-block" />
                              Vente Notariée
                            </span>
                          )}
                        </div>
                      )}

                      {/* Surface badge bottom-right */}
                      <div className="absolute bottom-3 right-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-black/50 text-white backdrop-blur-sm">
                          {p.superficie.toLocaleString('fr-FR')} m²
                        </span>
                      </div>
                    </div>

                    {/* Corps de la carte */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">
                        {p.titre}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 truncate">
                          {p.arrondissement}, {p.ville}, {p.pays}
                        </span>
                      </div>

                      {/* Prix */}
                      <div className="mt-3">
                        <p className="text-xl font-bold" style={{ color: '#0D2A4E' }}>
                          {p.prixFCFA.toLocaleString('fr-FR')}{' '}
                          <span className="text-base font-semibold">FCFA</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ${usd.toLocaleString('en')} · €{eur.toLocaleString('en')}
                        </p>
                      </div>

                      {/* Badges légaux */}
                      {(p.titreFoncier || p.venteNotariee || p.viabilisation) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.titreFoncier && (
                            <span
                              className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-medium"
                              style={{ borderColor: '#C9A84C', color: '#C9A84C', backgroundColor: '#FFFBEB' }}
                            >
                              <span className="w-2 h-2 rounded-full border border-current inline-block" />
                              Titre Foncier
                            </span>
                          )}
                          {p.venteNotariee && (
                            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50 font-medium">
                              <span className="w-2 h-2 rounded-full border border-current inline-block" />
                              Vente Notariée
                            </span>
                          )}
                          {p.viabilisation && (
                            <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border border-green-200 text-green-700 bg-green-50 font-medium">
                              <span className="w-2 h-2 rounded-full border border-current inline-block" />
                              Viabilisé
                            </span>
                          )}
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/parcelles/${p.id}`}
                          className="flex-1 text-center rounded-full py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: '#C9A84C' }}
                        >
                          Je suis intéressé
                        </Link>
                        {waNumber && (
                          <Link
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Contacter sur WhatsApp"
                            className="h-10 w-10 flex items-center justify-center rounded-full shrink-0 transition-opacity hover:opacity-90"
                            style={{ backgroundColor: '#25D366' }}
                          >
                            <MessageCircle size={18} className="text-white" fill="white" />
                          </Link>
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
