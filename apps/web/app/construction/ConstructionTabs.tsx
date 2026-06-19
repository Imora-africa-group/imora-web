'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Minus, Building2 } from 'lucide-react'
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

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto mb-8">
        {availableStandings.map((s) => (
          <button
            key={s}
            onClick={() => setActiveTab(s)}
            className={cn(
              'px-6 py-3 text-sm font-medium whitespace-nowrap border-b-3 transition-colors',
              activeTab === s
                ? 'border-b-2 font-bold'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
            )}
            style={
              activeTab === s
                ? { color: '#0D2A4E', borderBottomColor: '#C9A84C' }
                : {}
            }
          >
            {standingLabels[s]}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 size={40} className="mx-auto mb-3" />
          <p>Aucun modèle disponible pour ce standing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                {m.mainImageUrl ? (
                  <Image src={m.mainImageUrl} alt={m.titre} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 size={40} className="text-gray-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                    style={{ backgroundColor: '#0D2A4E' }}
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
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Prix de base</p>
                  <PriceDisplay fcfa={m.prixFCFA} usd={m.usd} eur={m.eur} size="lg" />
                </div>

                {m.inclus.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Inclus dans le prix</p>
                    <ul className="space-y-1.5">
                      {m.inclus.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <Check size={12} className="mt-0.5 shrink-0" style={{ color: '#C9A84C' }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.optionsNonIncluses.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-400 mb-2">Options non incluses</p>
                    <ul className="space-y-1">
                      {m.optionsNonIncluses.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                          <Minus size={10} className="shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={`/simulation?standing=${m.standing}`}
                  className="mt-5 flex items-center justify-center rounded-full py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#C9A84C' }}
                >
                  Démarrer ce projet
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
