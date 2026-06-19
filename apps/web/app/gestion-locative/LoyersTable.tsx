'use client'

import { useState } from 'react'

const STANDING_LABELS: Record<string, string> = {
  BASIQUE: 'Basique',
  MOYEN: 'Moyen Standing',
  HAUT_STANDING: 'Haut Standing',
  LUXE: 'Luxe',
}

type Loyer = {
  id: string
  zone: string
  ville: string
  standing: string
  modele: string | null
  nbPieces: number
  loyerMinFCFA: number
  loyerMaxFCFA: number
  minUsd: number
  minEur: number
  maxUsd: number
  maxEur: number
}

export function LoyersTable({ loyers }: { loyers: Loyer[] }) {
  const [ville, setVille] = useState('')
  const [standing, setStanding] = useState('')
  const [nbPieces, setNbPieces] = useState('')

  const villes = [...new Set(loyers.map((l) => l.ville))].sort()
  const standings = [...new Set(loyers.map((l) => l.standing))]
  const pieces = [...new Set(loyers.map((l) => l.nbPieces))].sort((a, b) => a - b)

  const filtered = loyers.filter(
    (l) =>
      (!ville || l.ville === ville) &&
      (!standing || l.standing === standing) &&
      (!nbPieces || l.nbPieces === parseInt(nbPieces))
  )

  const selectClass =
    'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select className={selectClass} value={ville} onChange={(e) => setVille(e.target.value)}>
          <option value="">Toutes les villes</option>
          {villes.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className={selectClass} value={standing} onChange={(e) => setStanding(e.target.value)}>
          <option value="">Tous les standings</option>
          {standings.map((s) => <option key={s} value={s}>{STANDING_LABELS[s]}</option>)}
        </select>
        <select className={selectClass} value={nbPieces} onChange={(e) => setNbPieces(e.target.value)}>
          <option value="">Toutes pièces</option>
          {pieces.map((p) => <option key={p} value={p}>{p} pièce{p > 1 ? 's' : ''}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#0D2A4E' }}>
                {['Zone', 'Ville', 'Standing', 'Type', 'Nb Pièces', 'Loyer Min', 'Loyer Max'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{l.zone}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{l.ville}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                      {STANDING_LABELS[l.standing]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{l.modele ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{l.nbPieces}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                      {l.loyerMinFCFA.toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      ${l.minUsd.toLocaleString('en-US')} · €{l.minEur.toLocaleString('fr-FR')}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                      {l.loyerMaxFCFA.toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      ${l.maxUsd.toLocaleString('en-US')} · €{l.maxEur.toLocaleString('fr-FR')}
                    </p>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Aucun résultat pour ces filtres
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
