import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { MapPin, Building2, Key } from 'lucide-react'
import { prisma, getOptimizedUrl } from '@imora/db'
import { getTranslations } from 'next-intl/server'
import { OffresSection } from '@/components/OffresSection'
import { GalerieSection } from '@/components/GalerieSection'
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel'
import { FaqAccordion } from '@/components/FaqAccordion'
import { CTASection } from '@/components/CTASection'
import DotsCloud from '@/components/DotsCloud'
import { HeroSlogan } from '@/components/HeroSlogan'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "L'immobilier sécurisé, sans tracasserie",
    description: 'IMORA AFRICA — Achetez, construisez et gérez vos biens immobiliers en Afrique en toute sécurité.',
    openGraph: {
      title: 'IMORA AFRICA',
      description: "L'immobilier sécurisé, sans tracasserie",
    },
  }
}

export default async function HomePage() {
  const t = await getTranslations('home')

  const [settings, partenaires, avis, faqs] =
    await Promise.all([
      prisma.settings.findUnique({ where: { id: 'singleton' } }).catch(() => null),
      prisma.partenaire.findMany({ where: { isActive: true }, orderBy: { ordre: 'asc' } }).catch(() => []),
      prisma.avis.findMany({ where: { isPublished: true }, take: 9, orderBy: { dateAvis: 'desc' } }).catch(() => []),
      prisma.fAQ.findMany({ where: { isPublished: true }, orderBy: { ordre: 'asc' }, take: 6 }).catch(() => []),
    ])

  const services = [
    { icon: MapPin, titre: t('service1Title'), description: t('service1Desc'), href: '/parcelles' as const },
    { icon: Building2, titre: t('service2Title'), description: t('service2Desc'), href: '/construction' as const },
    { icon: Key, titre: t('service3Title'), description: t('service3Desc'), href: '/gestion-locative' as const },
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
          <HeroSlogan text={t('heroSlogan')} />
          <p className="mt-6 text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            {t('heroDesc')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/parcelles"
              className="inline-flex items-center rounded-full px-8 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9A84C' }}
            >
              {t('heroCtaOffers')}
            </Link>
            <Link
              href="/simulation"
              className="inline-flex items-center rounded-full px-8 py-3.5 font-semibold border-2 border-white text-white hover:bg-white/10 transition-colors"
            >
              {t('heroCtaSimulate')}
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
                    {t('learnMore')}
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

      {/* ── PARTENAIRES ── */}
      {partenaires.length > 0 && (
        <section className="py-16 px-4 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-serif font-bold text-center mb-10" style={{ color: '#0D2A4E' }}>
              {t('partners')}
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
        <section className="relative overflow-hidden py-20 px-4" style={{ backgroundColor: '#F2F4F7' }}>
          {/* Nuage de points — DERRIÈRE tout */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <DotsCloud />
          </div>

          {/* Contenu — AU-DESSUS du nuage */}
          <div className="relative z-10 mx-auto max-w-7xl">
            <h2 className="text-3xl font-serif font-bold text-center mb-12" style={{ color: '#0D2A4E' }}>
              {t('testimonials')}
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
              {t('faq')}
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
