'use client'

import { useId, useState } from 'react'
import { BENIN_VILLES, BENIN_VILLE_NOMS, getArrondissements, WORLD_COUNTRIES } from '@imora/types'

export interface LocationValue {
  pays: string
  ville: string
  arrondissement: string
}

interface LocationSelectorProps {
  value: LocationValue
  onChange: (next: LocationValue) => void
  /** Show the pays (country) selector. Default: true */
  showPays?: boolean
  /** Show the ville selector. Default: true */
  showVille?: boolean
  /** Show the arrondissement selector. Default: true */
  showArrondissement?: boolean
  /** Label for the pays field. Default: "Pays" */
  paysLabel?: string
  /** Label for the ville field. Default: "Ville" */
  villeLabel?: string
  /** Label for the arrondissement field. Default: "Arrondissement" */
  arrondissementLabel?: string
  /** Extra classes applied to the outer wrapper */
  className?: string
  /** Disable all fields */
  disabled?: boolean
}

const SELECT =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ' +
  'disabled:bg-gray-50 disabled:text-gray-400 appearance-none'

const INPUT =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ' +
  'disabled:bg-gray-50 disabled:text-gray-400 placeholder:text-gray-400'

const LABEL = 'block text-sm font-medium text-gray-700 mb-1.5'

export function LocationSelector({
  value,
  onChange,
  showPays = true,
  showVille = true,
  showArrondissement = true,
  paysLabel = 'Pays',
  villeLabel = 'Ville',
  arrondissementLabel = 'Arrondissement',
  className = '',
  disabled = false,
}: LocationSelectorProps) {
  const uid = useId()
  const [autreArrondissement, setAutreArrondissement] = useState(false)

  const isBenin = value.pays === 'Bénin'
  const arrondissements = getArrondissements(value.ville)

  function handlePays(pays: string) {
    // Cascade: reset ville + arrondissement when country changes
    onChange({ pays, ville: '', arrondissement: '' })
    setAutreArrondissement(false)
  }

  function handleVille(ville: string) {
    // Cascade: reset arrondissement when city changes
    onChange({ ...value, ville, arrondissement: '' })
    setAutreArrondissement(false)
  }

  function handleArrondissement(arr: string) {
    if (arr === '__autre__') {
      setAutreArrondissement(true)
      onChange({ ...value, arrondissement: '' })
    } else {
      setAutreArrondissement(false)
      onChange({ ...value, arrondissement: arr })
    }
  }

  const datalistId = `${uid}-countries`

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── Pays ── */}
      {showPays && (
        <div>
          <label className={LABEL}>{paysLabel}</label>
          {/* Input + datalist for ~200 countries — native browser autocomplete */}
          <input
            list={datalistId}
            value={value.pays}
            onChange={(e) => handlePays(e.target.value)}
            disabled={disabled}
            placeholder="Saisir un pays…"
            className={INPUT}
            autoComplete="off"
          />
          <datalist id={datalistId}>
            {WORLD_COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      )}

      {/* ── Ville ── */}
      {showVille && (
        <div>
          <label className={LABEL}>{villeLabel}</label>
          {isBenin ? (
            <div className="relative">
              <select
                value={value.ville}
                onChange={(e) => handleVille(e.target.value)}
                disabled={disabled}
                className={SELECT}
              >
                <option value="">Sélectionner une ville</option>
                {BENIN_VILLE_NOMS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <ChevronDown />
            </div>
          ) : (
            <input
              value={value.ville}
              onChange={(e) => onChange({ ...value, ville: e.target.value })}
              disabled={disabled}
              placeholder="Ville"
              className={INPUT}
            />
          )}
        </div>
      )}

      {/* ── Arrondissement ── */}
      {showArrondissement && (
        <div>
          <label className={LABEL}>{arrondissementLabel}</label>
          {isBenin && value.ville && arrondissements.length > 0 ? (
            <>
              <div className="relative">
                <select
                  value={autreArrondissement ? '__autre__' : value.arrondissement}
                  onChange={(e) => handleArrondissement(e.target.value)}
                  disabled={disabled}
                  className={SELECT}
                >
                  <option value="">Sélectionner un arrondissement</option>
                  {arrondissements.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                  <option value="__autre__">Autre — préciser</option>
                </select>
                <ChevronDown />
              </div>
              {autreArrondissement && (
                <input
                  value={value.arrondissement}
                  onChange={(e) => onChange({ ...value, arrondissement: e.target.value })}
                  disabled={disabled}
                  placeholder="Précisez l'arrondissement"
                  className={`${INPUT} mt-2`}
                  autoFocus
                />
              )}
            </>
          ) : (
            <input
              value={value.arrondissement}
              onChange={(e) => onChange({ ...value, arrondissement: e.target.value })}
              disabled={disabled}
              placeholder="Arrondissement / Zone"
              className={INPUT}
            />
          )}
        </div>
      )}
    </div>
  )
}

/** Small inline chevron for styled <select> */
function ChevronDown() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400">
        <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/** Simpler variant — pays only (for diaspora contact forms) */
export function PaysSelector({
  value,
  onChange,
  label = 'Pays de résidence',
  disabled = false,
  className = '',
  name,
  required,
}: {
  value: string
  onChange: (pays: string) => void
  label?: string
  disabled?: boolean
  className?: string
  /** HTML name attribute — required for native form FormData submission */
  name?: string
  required?: boolean
}) {
  const uid = useId()
  const datalistId = `${uid}-countries`

  return (
    <div className={className}>
      <label className={LABEL}>{label}</label>
      <input
        list={datalistId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Saisir votre pays…"
        className={INPUT}
        autoComplete="off"
        name={name}
        required={required}
      />
      <datalist id={datalistId}>
        {WORLD_COUNTRIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
  )
}
