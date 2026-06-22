import Link from 'next/link'
import Image from 'next/image'

interface OffreCardProps {
  title: string
  description: string
  badge: string
  buttonLabel: string
  href: string
  src: string
  featured?: boolean
}

function OffreCard({ title, description, badge, buttonLabel, href, src, featured }: OffreCardProps) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-2xl cursor-pointer ${
        featured ? 'md:flex-[1.2]' : 'flex-1'
      }`}
    >
      <div
        className={`relative w-full ${
          featured ? 'h-[320px] md:h-[520px]' : 'h-[320px] md:h-[480px]'
        }`}
      >
        {/* Photo avec zoom au hover */}
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
          priority={false}
        />

        {/* Overlay gradient de base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(13,42,78,0.90) 0%, rgba(13,42,78,0.40) 50%, rgba(13,42,78,0.10) 100%)',
          }}
        />

        {/* Overlay additionnel — s'assombrit au hover */}
        <div className="absolute inset-0 bg-[rgba(13,42,78,0.10)] opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />

        {/* Badge — coin haut gauche */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
            style={{ backgroundColor: '#C9A84C' }}
          >
            {badge}
          </span>
        </div>

        {/* Contenu ancré en bas */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
          <h3
            className="font-serif text-white leading-tight mb-2"
            style={{ fontSize: featured ? '2rem' : '1.75rem' }}
          >
            {title}
          </h3>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-5">
            {description}
          </p>
          <span
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold border-2 border-white text-white transition-all duration-300 group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C]"
          >
            {buttonLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}

const offres: OffreCardProps[] = [
  {
    title: 'Terrains & Parcelles',
    description: 'Parcelles viabilisées avec Titre Foncier. Investissez en toute sécurité.',
    badge: 'Parcelles',
    buttonLabel: 'Voir les parcelles →',
    href: '/parcelles',
    src: '/demo/apart-1.png',
  },
  {
    title: 'Constructions Clé en Main',
    description:
      'Du basique au luxe, nous réalisons votre projet avec des finitions de qualité.',
    badge: 'Construction',
    buttonLabel: 'Voir les modèles →',
    href: '/construction',
    src: '/demo/apart-7.png',
    featured: true,
  },
  {
    title: 'Logements & Gestion Locative',
    description: 'Louez en toute tranquillité. Loyer garanti chaque mois, zéro tracas.',
    badge: 'Locatif',
    buttonLabel: 'Voir les logements →',
    href: '/gestion-locative',
    src: '/demo/apart-9.png',
  },
]

export function OffresSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <div className="text-center mb-10 md:mb-14">
          <h2
            className="text-3xl md:text-4xl font-serif font-bold"
            style={{ color: '#0D2A4E' }}
          >
            Découvrez nos offres
          </h2>
          <p className="mt-3 text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Parcelles sécurisées, constructions clé en main, logements à louer — tout en un
            seul endroit.
          </p>
        </div>

        {/* Grid des cards */}
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          {offres.map((offre) => (
            <OffreCard key={offre.href} {...offre} />
          ))}
        </div>
      </div>
    </section>
  )
}
