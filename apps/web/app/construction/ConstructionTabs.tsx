'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Minus, Building2, Home } from 'lucide-react'
import { PriceDisplay } from '@/components/PriceDisplay'
import { cn } from '@/lib/utils'

type Modele = {
  id: string
  titre: string
  standing: string
  prixFCFA: number
  superficie: number
  nbPieces: number
  niveaux: string
  inclus: string[]
  optionsNonIncluses: string[]
  mainImageUrl: string | null
  usd: number
  eur: number
}

const STANDINGS = ['BASIQUE', 'MOYEN', 'HAUT_STANDING', 'LUXE']

const DEMO_IMAGES_CONSTRUCTION = [
  '/demo/apart-4.png',
  '/demo/apart-6.png',
  '/demo/apart-7.png',
  '/demo/apart-8.png',
  '/demo/apart-10.png',
  '/demo/apart-11.png',
]

export function ConstructionTabs({
  modeles,
  standingLabels,
}: {
  modeles: Modele[]
  standingLabels: Record<string, string>
}) {
  const availableStandings = STANDINGS.filter((s) => modeles.some((m) => m.standing === s))
  const [activeTab, setActiveTab] = useState(availableStandings[0] ?? 'BASIQUE')

  const filtered = modeles.filter((m) => m.standing === activeTab)
  const primary = filtered[0]
  const additional = filtered.slice(1)

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto mb-10">
        {availableStandings.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={cn(
              'px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === s
                ? 'font-bold border-b-2'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
            )}
            style={activeTab === s ? { color: '#0D2A4E', borderBottomColor: '#C9A84C' } : {}}
          >
            {standingLabels[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Building2 size={48} className="mx-auto mb-3" />
          <p>Aucun modèle disponible pour ce standing</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Featured model — large 2-col layout */}
          {primary && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="grid md:grid-cols-[5fr_4fr]">
                {/* Images */}
                <div className="grid grid-cols-2 gap-1 md:gap-2 bg-gray-50 h-80 md:h-auto">
                  <div className="relative col-span-1 overflow-hidden">
                    <Image
                      src={primary.mainImageUrl ?? DEMO_IMAGES_CONSTRUCTION[0]}
                      alt={primary.titre}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative col-span-1 overflow-hidden">
                    <Image
                      src={DEMO_IMAGES_CONSTRUCTION[1]}
                      alt={primary.titre}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-8 flex flex-col justify-center">
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit"
                    style={{ backgroundColor: '#FEF3C7', color: '#C9A84C' }}
                  >
                    {standingLabels[primary.standing]}
                  </span>

                  <h3 className="text-2xl font-serif font-bold leading-snug" style={{ color: '#0D2A4E' }}>
                    {primary.titre}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {primary.superficie} m² · {primary.nbPieces} pièces · {primary.niveaux}
                  </p>

                  <div className="mt-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Prix de base</p>
                    <PriceDisplay fcfa={primary.prixFCFA} usd={primary.usd} eur={primary.eur} size="lg" />
                  </div>

                  {primary.inclus.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Inclus dans le prix de base
                      </p>
                      <ul className="space-y-2">
                        {primary.inclus.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check size={14} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {primary.optionsNonIncluses.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        Options non incluses
                      </p>
                      <ul className="space-y-1.5">
                        {primary.optionsNonIncluses.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <Minus size={12} className="shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href={`/simulation?standing=${primary.standing}`}
                    className="mt-7 inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#C9A84C' }}
                  >
                    Démarrer ce projet
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Additional models grid */}
          {additional.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additional.map((m, idx) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={m.mainImageUrl ?? DEMO_IMAGES_CONSTRUCTION[(idx + 2) % DEMO_IMAGES_CONSTRUCTION.length]}
                      alt={m.titre}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                        style={{ backgroundColor: 'rgba(13,42,78,0.85)' }}
                      >
                        {standingLabels[m.standing]}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900">{m.titre}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {m.superficie} m² · {m.nbPieces} pièces · {m.niveaux}
                    </p>

                    <div className="mt-4">
                      <PriceDisplay fcfa={m.prixFCFA} usd={m.usd} eur={m.eur} size="md" />
                    </div>

                    {m.inclus.slice(0, 3).length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {m.inclus.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <Check size={11} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link
                      href={`/simulation?standing=${m.standing}`}
                      className="mt-5 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#C9A84C' }}
                    >
                      <Home size={14} />
                      Démarrer ce projet
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
