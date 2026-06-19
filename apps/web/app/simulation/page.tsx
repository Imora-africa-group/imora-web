import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma, getOptimizedUrl } from '@imora/db'
import { SimulationWizard } from './SimulationWizard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Simulation de Projet',
  description: "Estimez le coût de votre projet immobilier en 3 étapes simples avec IMORA AFRICA.",
  openGraph: {
    title: 'Simulation — IMORA AFRICA',
    description: "Estimez le coût de votre projet immobilier en 3 étapes simples",
  },
}

export default async function SimulationPage() {
  const [parcelles, modeles, loyers, settings] = await Promise.all([
    prisma.parcelle.findMany({
      where: { status: 'PUBLISHED' },
      select: { ville: true, arrondissement: true, prixFCFA: true },
    }),
    prisma.modeleConstruction.findMany({
      where: { status: 'PUBLISHED' },
      include: { images: { orderBy: { ordre: 'asc' }, take: 1 } },
      orderBy: { prixFCFA: 'asc' },
    }),
    prisma.loyer.findMany({
      select: { ville: true, standing: true, loyerMinFCFA: true, loyerMaxFCFA: true },
    }),
    prisma.settings.findUnique({ where: { id: 'singleton' } }),
  ])

  const rates = {
    usd: settings?.exchangeRateUSD ?? 0.00165,
    eur: settings?.exchangeRateEUR ?? 0.00152,
  }

  const modelesForClient = modeles.map((m) => {
    const mainImg = m.images[0]
    return {
      id: m.id,
      titre: m.titre,
      standing: m.standing,
      prixFCFA: m.prixFCFA,
      superficie: m.superficie,
      inclus: m.inclus as string[],
      mainImageUrl: mainImg ? getOptimizedUrl(mainImg.cloudinaryPublicId, 400, 260) : null,
      usd: Math.round(m.prixFCFA * rates.usd),
      eur: Math.round(m.prixFCFA * rates.eur),
    }
  })

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0D2A4E' }} className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-serif text-white">Simulation de Projet</h1>
          <p className="mt-3 text-white/70 text-lg">
            Estimez le coût de votre projet immobilier en 3 étapes simples
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="py-12 px-4 min-h-[60vh]" style={{ backgroundColor: '#F2F4F7' }}>
        <div className="mx-auto max-w-3xl">
          <Suspense>
            <SimulationWizard
              parcelles={parcelles}
              modeles={modelesForClient}
              loyers={loyers}
              rates={rates}
              waNumber={settings?.whatsappNumber ?? ''}
            />
          </Suspense>
        </div>
      </section>
    </>
  )
}
