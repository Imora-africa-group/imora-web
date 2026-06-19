import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma, getOptimizedUrl, buildWhatsAppUrl, WA_MESSAGES } from '@imora/db'
import { ParcelleDetail } from './ParcelleDetail'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const parcelle = await prisma.parcelle.findUnique({ where: { id } })
  if (!parcelle) return { title: 'Parcelle introuvable' }
  return {
    title: parcelle.titre,
    description: `${parcelle.superficie} m² à ${parcelle.ville} — ${parcelle.prixFCFA.toLocaleString('fr-FR')} FCFA`,
  }
}

export default async function ParcelleDetailPage({ params }: PageProps) {
  const { id } = await params

  const [parcelle, settings] = await Promise.all([
    prisma.parcelle.findUnique({
      where: { id, status: 'PUBLISHED' },
      include: { images: { orderBy: { ordre: 'asc' } } },
    }),
    prisma.settings.findUnique({ where: { id: 'singleton' } }),
  ])

  if (!parcelle) notFound()

  const rates = {
    usd: settings?.exchangeRateUSD ?? 0.00165,
    eur: settings?.exchangeRateEUR ?? 0.00152,
  }

  const waNumber = settings?.whatsappNumber ?? ''
  const waUrl = waNumber
    ? buildWhatsAppUrl(waNumber, WA_MESSAGES.parcelle(parcelle.titre))
    : '#'

  const imageUrls = parcelle.images.map((img) =>
    getOptimizedUrl(img.cloudinaryPublicId, 900, 506)
  )

  return (
    <div className="py-12 px-4 pb-24 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <ParcelleDetail
          parcelle={parcelle}
          rates={rates}
          waUrl={waUrl}
          imageUrls={imageUrls}
        />
      </div>
    </div>
  )
}
