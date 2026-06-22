import Link from 'next/link'
import Image from 'next/image'

function PhotoLink({
  href,
  src,
  alt,
  className = '',
}: {
  href: string
  src: string
  alt: string
  className?: string
}) {
  return (
    <Link href={href} className={`group block relative overflow-hidden rounded-xl ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-[300ms] ease-out group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </Link>
  )
}

function RowHeader({
  title,
  href,
}: {
  title: string
  href: string
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-[#222222]">{title}</h2>
      <Link
        href={href}
        className="shrink-0 ml-4 text-sm font-medium border-[1.5px] border-[#0D2A4E] rounded-[24px] px-5 py-2 text-[#0D2A4E] transition-colors duration-200 hover:bg-[#0D2A4E] hover:text-white"
      >
        Voir tout →
      </Link>
    </div>
  )
}

export function GalerieSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6">

        {/* ── RANGÉE 1 — Parcelles : 4 photos landscape ── */}
        <RowHeader
          title="Nos Parcelles & Terrains"
          href="/parcelles"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <PhotoLink href="/parcelles" src="/demo/apart-2.png" alt="Parcelle sécurisée avec piscine" className="aspect-[3/2]" />
          <PhotoLink href="/parcelles" src="/demo/apart-4.png" alt="Villa moderne éclairée" className="aspect-[3/2]" />
          <PhotoLink href="/parcelles" src="/demo/apart-6.png" alt="Maison moderne avec entrée" className="aspect-[3/2]" />
          <PhotoLink href="/parcelles" src="/demo/apart-8.png" alt="Villa contemporaine avec piscine" className="aspect-[3/2]" />
        </div>

        {/* ── RANGÉE 2 — Constructions : layout éditorial ── */}
        <div className="mt-16">
          <RowHeader
            title="Nos Constructions"
            href="/construction"
          />
          {/* Desktop: grande photo gauche + 2 empilées droite. Mobile: 3 photos empilées */}
          <div className="flex flex-col md:flex-row gap-3 md:h-[500px]">
            {/* A — grande gauche */}
            <PhotoLink
              href="/construction"
              src="/demo/apart-7.png"
              alt="Villa moderne de construction"
              className="aspect-video flex-none md:w-2/3 md:h-full md:aspect-auto"
            />
            {/* B + C — empilées droite */}
            <div className="flex flex-col gap-3 md:flex-1 md:h-full">
              <PhotoLink
                href="/construction"
                src="/demo/apart-1.png"
                alt="Terrain au coucher de soleil"
                className="aspect-video md:flex-1 md:aspect-auto"
              />
              <PhotoLink
                href="/construction"
                src="/demo/apart-10.png"
                alt="Construction moderne bois et béton"
                className="aspect-video md:flex-1 md:aspect-auto"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
