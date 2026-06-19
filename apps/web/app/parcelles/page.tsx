import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, MessageCircle } from 'lucide-react'
import { prisma, getOptimizedUrl, buildWhatsAppUrl, WA_MESSAGES } from '@imora/db'
import { PriceDisplay } from '@/components/PriceDisplay'
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
      <section style={{ backgroundColor: '#0D2A4E' }} className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-serif text-white">Nos Parcelles Disponibles</h1>
          <p className="mt-3 text-white/70 text-lg">
            Découvrez nos terrains avec Titre Foncier, vérifiés et prêts à bâtir dans toute l&apos;Afrique de l&apos;Ouest.
          </p>
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
              {parcelles.map((p) => {
                const mainImg = p.images.find((i) => i.isMain) ?? p.images[0]
                const imgUrl = mainImg ? getOptimizedUrl(mainImg.cloudinaryPublicId, 600, 338) : null
                const usd = Math.round(p.prixFCFA * rates.usd)
                const eur = Math.round(p.prixFCFA * rates.eur)
                const waMsg = WA_MESSAGES.parcelle(p.titre)
                const waUrl = waNumber ? buildWhatsAppUrl(waNumber, waMsg) : '#'

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  >
                    {/* Photo */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={p.titre} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin size={32} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Badges sous la photo */}
                    {(p.titreFoncier || p.venteNotariee) && (
                      <div className="flex gap-2 px-4 pt-3">
                        {p.titreFoncier && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium border"
                            style={{ borderColor: '#C9A84C', color: '#C9A84C', backgroundColor: '#FFFBEB' }}>
                            ✓ Titre Foncier
                          </span>
                        )}
                        {p.venteNotariee && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium border border-blue-200 text-blue-700 bg-blue-50">
                            ✓ Vente Notariée
                          </span>
                        )}
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 leading-tight">{p.titre}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500">{p.arrondissement}, {p.ville}</span>
                      </div>
                      <div className="mt-3">
                        <PriceDisplay fcfa={p.prixFCFA} usd={usd} eur={eur} size="md" />
                        <p className="text-xs text-gray-400 mt-1">{p.superficie.toLocaleString('fr-FR')} m²</p>
                      </div>

                      {/* CTAs */}
                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/parcelles/${p.id}`}
                          className="flex-1 text-center rounded-full py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: '#0D2A4E' }}
                        >
                          Je suis intéressé
                        </Link>
                        {waNumber && (
                          <Link
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
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
