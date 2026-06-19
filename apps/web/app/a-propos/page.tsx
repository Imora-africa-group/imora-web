import type { Metadata } from 'next'
import { prisma } from '@imora/db'
import { getOptimizedUrl } from '@imora/db'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'À Propos',
  description:
    "Découvrez la mission, la vision et les valeurs d'IMORA AFRICA, votre partenaire de confiance pour l'immobilier en Afrique.",
  openGraph: {
    title: 'À Propos — IMORA AFRICA',
    description: "Votre partenaire de confiance pour l'immobilier en Afrique",
  },
}

const valeurs = [
  {
    titre: 'Transparence',
    texte:
      "Tous nos terrains sont vérifiés. Tous nos prix sont affichés. Toutes nos transactions sont notariées.",
  },
  {
    titre: 'Sécurité',
    texte:
      "Titre Foncier obligatoire, vérification systématique, partenaires certifiés. Zéro compromis sur la sécurité juridique.",
  },
  {
    titre: 'Accompagnement',
    texte:
      "De la première visite à la remise des clés, notre équipe vous accompagne à chaque étape de votre projet.",
  },
]

const equipe = [
  { nom: 'Amadou Diallo', poste: 'CEO & Fondateur', initiale: 'A' },
  { nom: 'Marie Kouassi', poste: 'Directrice Commerciale', initiale: 'M' },
  { nom: 'Jean-Baptiste Sow', poste: 'Directeur Technique', initiale: 'J' },
  { nom: 'Fatoumata Mbaye', poste: 'Responsable Juridique', initiale: 'F' },
]

export default async function AProposPage() {
  const realisations = await prisma.realisation.findMany({
    where: { status: 'PUBLISHED' },
    include: { images: { orderBy: { ordre: 'asc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#0D2A4E' }} className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-serif text-white">
            À Propos d&apos;IMORA AFRICA
          </h1>
          <p className="mt-3 text-white/70 text-lg">
            Votre partenaire de confiance pour l&apos;immobilier en Afrique
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-serif font-bold" style={{ color: '#0D2A4E' }}>Notre Mission</h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            IMORA AFRICA a pour mission de démocratiser l&apos;accès à l&apos;immobilier sécurisé en
            Afrique, particulièrement pour la diaspora. Nous simplifions chaque étape du processus,
            de l&apos;achat de parcelle à la construction, en passant par la gestion locative.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-serif font-bold" style={{ color: '#0D2A4E' }}>Notre Vision</h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Devenir la référence de l&apos;immobilier transparent et sécurisé en Afrique de l&apos;Ouest.
            Un immobilier sans tracasserie, où chaque transaction est protégée, chaque projet est
            livré dans les délais, et chaque investisseur peut suivre l&apos;évolution de son bien en
            temps réel.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valeurs.map((v) => (
              <div key={v.titre} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <h3 className="text-xl font-serif font-bold mb-4" style={{ color: '#C9A84C' }}>
                  {v.titre}
                </h3>
                <p className="text-gray-600 leading-relaxed">{v.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
            Notre Équipe
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {equipe.map((m) => (
              <div key={m.nom} className="text-center">
                <div
                  className="mx-auto h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4"
                  style={{ backgroundColor: '#4A6080' }}
                >
                  {m.initiale}
                </div>
                <p className="font-semibold text-gray-900">{m.nom}</p>
                <p className="text-sm text-gray-500 mt-0.5">{m.poste}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations highlight */}
      {realisations.length > 0 && (
        <section className="py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
              Nos Réalisations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {realisations.map((r) => {
                const img = r.images[0]
                const imgUrl = img ? getOptimizedUrl(img.cloudinaryPublicId, 400, 300) : null
                return (
                  <div key={r.id} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                    {imgUrl ? (
                      <Image src={imgUrl} alt={r.titre} fill className="object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-semibold leading-tight">{r.titre}</p>
                      <p className="text-white/70 text-xs mt-0.5">{r.zone} · {r.annee}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/construction"
                className="inline-flex items-center rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#C9A84C' }}
              >
                Voir toutes nos réalisations
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
