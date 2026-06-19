'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface Props {
  villes: string[]
  arrondissements: string[]
  currentParams: Record<string, string | undefined>
}

export function ParcellesFilters({ villes, arrondissements, currentParams }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const buildUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = { ...currentParams, ...updates }
      const qs = Object.entries(next)
        .filter(([, v]) => v !== undefined && v !== '' && v !== 'all')
        .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
        .join('&')
      return qs ? `${pathname}?${qs}` : pathname
    },
    [currentParams, pathname]
  )

  function update(key: string, value: string) {
    router.push(buildUrl({ [key]: value || undefined }))
  }

  const selectClass =
    'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'
  const inputClass =
    'w-28 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-gray-400'
  const toggleClass = (active: boolean) =>
    `px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer select-none transition-colors ${
      active
        ? 'border-amber-400 bg-amber-50 text-amber-700'
        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
    }`

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className={selectClass}
        value={currentParams.ville ?? ''}
        onChange={(e) => update('ville', e.target.value)}
      >
        <option value="">Toutes les villes</option>
        {villes.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      {arrondissements.length > 0 && (
        <select
          className={selectClass}
          value={currentParams.arrondissement ?? ''}
          onChange={(e) => update('arrondissement', e.target.value)}
        >
          <option value="">Tous les arrondissements</option>
          {arrondissements.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      )}

      <input
        type="number"
        placeholder="Prix min (FCFA)"
        className={inputClass}
        defaultValue={currentParams.prixMin ?? ''}
        onBlur={(e) => update('prixMin', e.target.value)}
      />
      <input
        type="number"
        placeholder="Prix max (FCFA)"
        className={inputClass}
        defaultValue={currentParams.prixMax ?? ''}
        onBlur={(e) => update('prixMax', e.target.value)}
      />

      <button
        className={toggleClass(currentParams.titreFoncier === 'true')}
        onClick={() => update('titreFoncier', currentParams.titreFoncier === 'true' ? '' : 'true')}
      >
        Titre Foncier
      </button>
      <button
        className={toggleClass(currentParams.venteNotariee === 'true')}
        onClick={() => update('venteNotariee', currentParams.venteNotariee === 'true' ? '' : 'true')}
      >
        Vente Notariée
      </button>
      <button
        className={toggleClass(currentParams.viabilisation === 'true')}
        onClick={() => update('viabilisation', currentParams.viabilisation === 'true' ? '' : 'true')}
      >
        Viabilisé
      </button>

      <Link href="/parcelles" className="text-sm text-gray-400 hover:text-gray-600 underline ml-1">
        Réinitialiser
      </Link>
    </div>
  )
}
