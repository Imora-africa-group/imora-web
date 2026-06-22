import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2, Key } from 'lucide-react'
import { prisma, getOptimizedUrl } from '@imora/db'
import { StatsSection } from '@/components/StatsCounter'
import { OffresSection } from '@/components/OffresSection'
import { GalerieSection } from '@/components/GalerieSection'
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel'
import { FaqAccordion } from '@/components/FaqAccordion'
import { CTASection } from '@/components/CTASection'

export const revalidate = 3600

export const metadata: Metadata = {
  title: "L'immobilier sécurisé, sans tracasserie",
  description:
    "IMORA AFRICA — Achetez, construisez et gérez vos biens immobiliers en Afrique en toute sécurité.",
  openGraph: {
    title: 'IMORA AFRICA',
    description: "L'immobilier sécurisé, sans tracasserie",
  },
}

const services = [
  {
    icon: MapPin,
    titre: 'Parcelles Sécurisées',
    description:
      "Des terrains vérifiés avec Titre Foncier, situés dans les meilleures zones de développement.",
    href: '/parcelles',
  },
  {
    icon: Building2,
    titre: 'Construction Clé en Main',
    description:
      "Du basique au luxe, nous réalisons votre projet de construction selon vos besoins.",
    href: '/construction',
  },
  {
    icon: Key,
    titre: 'Gestion Locative',
    description:
      "Confiez-nous la gestion de votre bien immobilier. Percevez vos loyers chaque mois.",
    href: '/gestion-locative',
  },
]

export default async function HomePage() {
  const [settings, override, parcelleCount, partenaireCount, partenaires, avis, faqs] =
    await Promise.all([
      prisma.settings.findUnique({ where: { id: 'singleton' } }),
      prisma.statOverride.findUnique({ where: { id: 'singleton' } }),
      prisma.parcelle.count({ where: { status: 'PUBLISHED' } }),
      prisma.partenaire.count({ where: { isActive: true } }),
      prisma.partenaire.findMany({ where: { isActive: true }, orderBy: { ordre: 'asc' } }),
      prisma.avis.findMany({ where: { isPublished: true }, take: 9, orderBy: { dateAvis: 'desc' } }),
      prisma.fAQ.findMany({ where: { isPublished: true }, orderBy: { ordre: 'asc' }, take: 6 }),
    ])

  const stats = [
    { value: override?.projetsRealises ?? 0, label: 'Projets réalisés', suffix: '+' },
    { value: override?.clientsSatisfaits ?? 0, label: 'Clients satisfaits', suffix: '+' },
    { value: parcelleCount, label: 'Parcelles disponibles' },
    { value: partenaireCount, label: 'Partenaires actifs' },
  ]

  const avisWithUrl = avis.map((a) => ({
    ...a,
    avatarUrl: a.cloudinaryPublicId ? getOptimizedUrl(a.cloudinaryPublicId, 80, 80) : null,
  }))

  const waNumber = settings?.whatsappNumber ?? ''

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/demo/apart-9.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,42,78,0.82) 0%, rgba(13,42,78,0.65) 60%, rgba(13,42,78,0.82) 100%)' }} />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
            {settings?.sloganText ?? "L'immobilier sécurisé, sans tracasserie"}
          </h1>
          <p className="mt-6 text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Achetez, construisez et gérez vos biens immobiliers en Afrique en toute sécurité,
            où que vous soyez dans le monde.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/parcelles"
              className="inline-flex items-center rounded-full px-8 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Voir nos offres
            </Link>
            <Link
              href="/simulation"
              className="inline-flex items-center rounded-full px-8 py-3.5 font-semibold border-2 border-white text-white hover:bg-white/10 transition-colors"
            >
              Faire une simulation
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.titre}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: '#FEF3C7' }}
                  >
                    <Icon size={22} style={{ color: '#C9A84C' }} />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3" style={{ color: '#0D2A4E' }}>
                    {s.titre}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.description}</p>
                  <Link
                    href={s.href}
                    className="text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ color: '#C9A84C' }}
                  >
                    En savoir plus →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── OFFRES ── */}
      <OffresSection />

      {/* ── GALERIE ── */}
      <GalerieSection />

      {/* ── STATS (masquée si tous les compteurs sont à 0) ── */}
      {((override?.projetsRealises ?? 0) > 0 ||
        (override?.clientsSatisfaits ?? 0) > 0 ||
        parcelleCount > 5 ||
        partenaireCount > 3) && <StatsSection stats={stats} />}

      {/* ── PARTENAIRES ── */}
      {partenaires.length > 0 && (
        <section className="py-16 px-4 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-serif font-bold text-center mb-10" style={{ color: '#0D2A4E' }}>
              Nos Partenaires de Confiance
            </h2>
            <div className="relative flex overflow-hidden">
              <div className="flex animate-marquee gap-6 items-center">
                {[...partenaires, ...partenaires].map((p, i) =>
                  p.cloudinaryPublicId ? (
                    <div
                      key={`${p.id}-${i}`}
                      className="shrink-0 h-16 w-40 relative grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 flex items-center justify-center border border-gray-100 rounded-xl bg-white px-4"
                    >
                      <Image
                        src={getOptimizedUrl(p.cloudinaryPublicId, 160, 64)}
                        alt={p.nom}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div
                      key={`${p.id}-${i}`}
                      className="shrink-0 h-16 flex items-center justify-center border border-gray-200 rounded-xl bg-white px-6 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#0D2A4E' }}>
                        {p.nom}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TÉMOIGNAGES ── */}
      {avisWithUrl.length > 0 && (
        <section className="py-20 px-4" style={{ backgroundColor: '#F2F4F7' }}>
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
              Ce que disent nos clients
            </h2>
            <TestimonialsCarousel avis={avisWithUrl} />
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
              Questions Fréquentes
            </h2>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* ── CTA FINAL ── */}
      <CTASection phone={waNumber} />
    </>
  )
}
