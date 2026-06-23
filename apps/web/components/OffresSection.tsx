import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

interface OffreCardProps {
  title: string
  description: string
  linkLabel: string
  href: string
  src: string
  alt: string
}

function OffreCard({ title, description, linkLabel, href, src, alt }: OffreCardProps) {
  return (
    <Link href={href} className="group cursor-pointer block">
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.03]"
          priority={false}
        />
      </div>
      <h3 className="font-serif text-xl mb-1" style={{ color: '#0D2A4E' }}>
        {title}
      </h3>
      <p className="text-sm mb-2 line-clamp-2" style={{ color: '#4A6080' }}>
        {description}
      </p>
      <span
        className="text-sm font-medium flex items-center gap-1 group-hover:underline"
        style={{ color: '#C9A84C' }}
      >
        {linkLabel}
      </span>
    </Link>
  )
}

export async function OffresSection() {
  const t = await getTranslations('offres')

  const offres: OffreCardProps[] = [
    {
      title: t('card1Title'),
      description: t('card1Desc'),
      linkLabel: t('card1Cta'),
      href: '/parcelles',
      src: '/demo/apart-3.png',
      alt: 'Terrain et parcelle sécurisée',
    },
    {
      title: t('card2Title'),
      description: t('card2Desc'),
      linkLabel: t('card2Cta'),
      href: '/construction',
      src: '/demo/apart-1.png',
      alt: 'Villa moderne construction clé en main',
    },
    {
      title: t('card3Title'),
      description: t('card3Desc'),
      linkLabel: t('card3Cta'),
      href: '/gestion-locative',
      src: '/demo/apart-9.png',
      alt: 'Logement moderne gestion locative',
    },
  ]

  return (
    <section id="offres" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-4xl" style={{ color: '#0D2A4E' }}>
              {t('title')}
            </h2>
            <Link
              href="/parcelles"
              className="shrink-0 ml-6 text-sm font-medium border-[1.5px] border-[#0D2A4E] rounded-[24px] px-5 py-2 text-[#0D2A4E] transition-colors duration-200 hover:bg-[#0D2A4E] hover:text-white"
            >
              {t('viewAll')}
            </Link>
          </div>
          <p className="text-lg" style={{ color: '#4A6080' }}>
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offres.map((offre) => (
            <OffreCard key={offre.href} {...offre} />
          ))}
        </div>
      </div>
    </section>
  )
}
