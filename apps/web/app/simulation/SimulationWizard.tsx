'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, MessageCircle } from 'lucide-react'
import { PaysSelector } from '@imora/ui'
import { submitSimulation } from './actions'
import { cn } from '@/lib/utils'

type Modele = {
  id: string
  titre: string
  standing: string
  prixFCFA: number
  superficie: number
  inclus: string[]
  mainImageUrl: string | null
  usd: number
  eur: number
}

type Loyer = {
  ville: string
  standing: string
  loyerMinFCFA: number
  loyerMaxFCFA: number
}

interface Props {
  parcelles: { ville: string; arrondissement: string; prixFCFA: number }[]
  modeles: Modele[]
  loyers: Loyer[]
  rates: { usd: number; eur: number }
  waNumber: string
}

const STANDING_LABELS: Record<string, string> = {
  BASIQUE: 'Basique',
  MOYEN: 'Moyen Standing',
  HAUT_STANDING: 'Haut Standing',
  LUXE: 'Luxe',
}

const EXTRAS = ['Clôture', 'Meubles', 'Jardin', 'Pack Décoration', 'Télévision', 'Rideaux']

function fmt(n: number) { return n.toLocaleString('fr-FR') }

export function SimulationWizard({ parcelles, modeles, loyers, rates, waNumber }: Props) {
  const router = useRouter()
  const sp = useSearchParams()
  const step = sp.get('step') ?? '1'

  // Step 1 state
  const [pays, setPays] = useState(sp.get('pays') ?? 'Bénin')
  const [ville, setVille] = useState(sp.get('ville') ?? '')
  const [arrondissement, setArrondissement] = useState(sp.get('arr') ?? '')

  // Step 2 state
  const [standing, setStanding] = useState(sp.get('standing') ?? '')
  const [selectedModele, setSelectedModele] = useState<Modele | null>(null)

  // Step 3 state
  const [gestionLocative, setGestionLocative] = useState<'oui' | 'non' | null>(
    sp.get('gl') === 'oui' ? 'oui' : sp.get('gl') === 'non' ? 'non' : null
  )

  // Form state
  const [isPending, startTransition] = useTransition()
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Derived data
  const villes = [...new Set(parcelles.map((p) => p.ville))].sort()
  const arrondissements = ville
    ? [...new Set(parcelles.filter((p) => p.ville === ville).map((p) => p.arrondissement))].sort()
    : []

  const filteredParcelles = parcelles.filter(
    (p) =>
      (!ville || p.ville === ville) &&
      (!arrondissement || p.arrondissement === arrondissement)
  )
  const parcelleMin = filteredParcelles.length > 0 ? Math.min(...filteredParcelles.map((p) => p.prixFCFA)) : null
  const parcelleMax = filteredParcelles.length > 0 ? Math.max(...filteredParcelles.map((p) => p.prixFCFA)) : null

  const standings = [...new Set(modeles.map((m) => m.standing))]
  const modelesByStanding = modeles.filter((m) => m.standing === standing)

  const loyerRef = loyers.filter(
    (l) => (!ville || l.ville === ville) && (!standing || l.standing === standing)
  )
  const loyerMin = loyerRef.length > 0 ? Math.min(...loyerRef.map((l) => l.loyerMinFCFA)) : null
  const loyerMax = loyerRef.length > 0 ? Math.max(...loyerRef.map((l) => l.loyerMaxFCFA)) : null

  function navigate(params: Record<string, string>) {
    const merged: Record<string, string> = {
      step, pays, ville, arr: arrondissement, standing, gl: gestionLocative ?? '',
      ...params,
    }
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')
    router.push(`/simulation?${qs}`)
  }

  const fieldClass =
    'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'
  const selectClass = `${fieldClass} appearance-none bg-white`

  // Progress bar
  const stepNum = parseInt(step)
  const isRecap = step === 'recap'
  const isForm = step === 'form'
  const progressStep = isForm || isRecap ? 4 : stepNum

  const Progress = () => (
    <div className="flex items-center justify-between mb-10">
      {[1, 2, 3].map((s) => {
        const done = progressStep > s
        const active = progressStep === s
        return (
          <div key={s} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors',
                  done || active
                    ? 'border-transparent text-white'
                    : 'border-gray-300 text-gray-400 bg-white'
                )}
                style={done || active ? { backgroundColor: '#C9A84C', borderColor: '#C9A84C' } : {}}
              >
                {s}
              </div>
              <p className="text-xs mt-2 text-gray-500">
                {s === 1 ? 'Votre parcelle' : s === 2 ? 'Votre construction' : 'Gestion locative'}
              </p>
            </div>
            {s < 3 && (
              <div
                className="flex-1 h-0.5 mx-3 mt-[-1.5rem]"
                style={{ backgroundColor: done ? '#C9A84C' : '#E5E7EB' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )

  // ── STEP 1 ──
  if (step === '1') {
    return (
      <div>
        <Progress />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#0D2A4E' }}>
            Étape 1: Votre Parcelle
          </h2>
          <div className="space-y-5">
            <PaysSelector
              value={pays}
              onChange={(p) => { setPays(p); setVille(''); setArrondissement('') }}
              label="Pays"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
              <select className={selectClass} value={ville} onChange={(e) => { setVille(e.target.value); setArrondissement('') }}>
                <option value="">Sélectionner une ville</option>
                {villes.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            {arrondissements.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zone / Arrondissement</label>
                <select className={selectClass} value={arrondissement} onChange={(e) => setArrondissement(e.target.value)}>
                  <option value="">Tous les arrondissements</option>
                  {arrondissements.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
            {parcelleMin !== null && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Estimation parcelle</p>
                <p className="text-2xl font-bold" style={{ color: '#0D2A4E' }}>
                  {parcelleMin === parcelleMax
                    ? `${fmt(parcelleMin)} FCFA`
                    : `${fmt(parcelleMin)} — ${fmt(parcelleMax!)} FCFA`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ${fmt(Math.round(parcelleMin * rates.usd))} · €{fmt(Math.round(parcelleMin * rates.eur))}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={() => navigate({ step: '2' })}
              disabled={!ville}
              className="rounded-full px-8 py-3 font-semibold text-white disabled:opacity-40"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── STEP 2 ──
  if (step === '2') {
    return (
      <div>
        <Progress />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#0D2A4E' }}>
            Étape 2: Votre Construction
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Standing</label>
            <select className={selectClass} value={standing} onChange={(e) => { setStanding(e.target.value); setSelectedModele(null) }}>
              <option value="">Sélectionner un standing</option>
              {standings.map((s) => <option key={s} value={s}>{STANDING_LABELS[s]}</option>)}
            </select>
          </div>

          {standing && modelesByStanding.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modelesByStanding.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModele(m.id === selectedModele?.id ? null : m)}
                  className={cn(
                    'text-left rounded-xl border-2 p-4 transition-all',
                    selectedModele?.id === m.id ? '' : 'border-gray-200 hover:border-gray-300'
                  )}
                  style={selectedModele?.id === m.id ? { borderColor: '#C9A84C', backgroundColor: '#FFFBEB' } : {}}
                >
                  {m.mainImageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <Image src={m.mainImageUrl} alt={m.titre} fill className="object-cover" />
                    </div>
                  )}
                  <p className="font-semibold text-gray-900">{m.titre}</p>
                  <p className="text-sm font-bold mt-1" style={{ color: '#0D2A4E' }}>
                    {fmt(m.prixFCFA)} FCFA
                  </p>
                  <p className="text-xs text-gray-400">${fmt(m.usd)} · €{fmt(m.eur)}</p>
                  {selectedModele?.id === m.id && m.inclus.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {m.inclus.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Check size={11} style={{ color: '#C9A84C' }} /> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              ))}
            </div>
          )}

          {selectedModele && (
            <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Estimation construction</p>
              <p className="text-2xl font-bold" style={{ color: '#0D2A4E' }}>
                {fmt(selectedModele.prixFCFA)} FCFA
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ${fmt(selectedModele.usd)} · €{fmt(selectedModele.eur)}
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button onClick={() => navigate({ step: '1' })} className="text-sm text-gray-500 hover:text-gray-700">
              Retour
            </button>
            <button
              onClick={() => navigate({ step: '3', standing })}
              disabled={!selectedModele}
              className="rounded-full px-8 py-3 font-semibold text-white disabled:opacity-40"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── STEP 3 ──
  if (step === '3') {
    return (
      <div>
        <Progress />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#0D2A4E' }}>
            Étape 3: Gestion Locative
          </h2>
          <p className="text-gray-600 mb-6">Souhaitez-vous ajouter la gestion locative à votre projet ?</p>

          <div className="flex gap-3">
            <button
              onClick={() => setGestionLocative('oui')}
              className={cn(
                'rounded-full px-6 py-2.5 text-sm font-semibold border-2 transition-colors',
                gestionLocative === 'oui'
                  ? 'text-white border-transparent'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              )}
              style={gestionLocative === 'oui' ? { backgroundColor: '#C9A84C', borderColor: '#C9A84C' } : {}}
            >
              Oui, gérer mon bien
            </button>
            <button
              onClick={() => setGestionLocative('non')}
              className={cn(
                'rounded-full px-6 py-2.5 text-sm font-semibold border-2 transition-colors',
                gestionLocative === 'non'
                  ? 'text-white border-transparent'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              )}
              style={gestionLocative === 'non' ? { backgroundColor: '#C9A84C', borderColor: '#C9A84C' } : {}}
            >
              Non, merci
            </button>
          </div>

          {gestionLocative === 'oui' && loyerMin !== null && (
            <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Revenus locatifs potentiels / mois</p>
              <p className="text-xl font-bold" style={{ color: '#0D2A4E' }}>
                {fmt(loyerMin)} — {fmt(loyerMax!)} FCFA
              </p>
              <p className="text-xs text-gray-400 mt-1">Commission IMORA : 10% du loyer</p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button onClick={() => navigate({ step: '2' })} className="text-sm text-gray-500 hover:text-gray-700">
              Retour
            </button>
            <button
              onClick={() => navigate({ step: 'recap', gl: gestionLocative ?? 'non' })}
              disabled={gestionLocative === null}
              className="rounded-full px-8 py-3 font-semibold text-white disabled:opacity-40"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Voir le récapitulatif
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── RECAP ──
  if (step === 'recap') {
    const glChoice = sp.get('gl')
    const modPrix = selectedModele?.prixFCFA ?? 0
    const parcMin = parcelleMin ?? 0
    const parcMax = parcelleMax ?? 0
    const total = Math.round((parcMin + parcMax) / 2) + modPrix

    const waMessage = [
      `Bonjour IMORA AFRICA, j'ai complété une simulation de projet :`,
      `• Zone : ${arrondissement ? arrondissement + ', ' : ''}${ville || pays}`,
      `• Construction : ${selectedModele?.titre ?? standing} (${STANDING_LABELS[standing] ?? standing})`,
      `• Gestion locative : ${glChoice === 'oui' ? 'Oui' : 'Non'}`,
      `• Total estimé : ${fmt(total)} FCFA`,
      `Je souhaite en savoir plus.`,
    ].join('\n')
    const waUrl = waNumber
      ? `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`
      : '#'

    return (
      <div>
        <Progress />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Doc header */}
          <div className="flex items-center justify-between px-8 py-5" style={{ backgroundColor: '#0D2A4E' }}>
            <div>
              <span className="font-serif text-xl" style={{ color: '#C9A84C' }}>IMORA</span>
              <span className="font-serif text-xl text-white ml-1.5">AFRICA</span>
            </div>
            <p className="text-white/70 text-sm">Récapitulatif de projet</p>
          </div>

          <div className="p-8 divide-y divide-gray-100">
            <div className="pb-4 flex justify-between">
              <span className="text-sm text-gray-500">Zone sélectionnée</span>
              <span className="text-sm font-medium text-gray-900">
                {[arrondissement, ville, pays].filter(Boolean).join(', ')}
              </span>
            </div>
            <div className="py-4 flex justify-between">
              <span className="text-sm text-gray-500">Standing construction</span>
              <span className="text-sm font-medium text-gray-900">
                {STANDING_LABELS[standing] ?? (standing || '—')}
              </span>
            </div>
            {selectedModele && (
              <div className="py-4 flex justify-between">
                <span className="text-sm text-gray-500">Modèle</span>
                <span className="text-sm font-medium text-gray-900">{selectedModele.titre}</span>
              </div>
            )}
            <div className="py-4 flex justify-between">
              <span className="text-sm text-gray-500">Gestion locative</span>
              <span className="text-sm font-semibold" style={{ color: glChoice === 'oui' ? '#16a34a' : '#6B7280' }}>
                {glChoice === 'oui' ? 'Oui' : 'Non'}
              </span>
            </div>

            {/* Total */}
            <div className="pt-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-xs text-gray-500 mb-1">Estimation totale</p>
                <p className="text-3xl font-bold" style={{ color: '#0D2A4E' }}>{fmt(total)} FCFA</p>
                <p className="text-sm text-gray-400 mt-1">
                  ${fmt(Math.round(total * rates.usd))} · €{fmt(Math.round(total * rates.eur))}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Ce récapitulatif est une estimation. Contactez IMORA pour un devis précis.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center px-8 py-6 border-t border-gray-100">
            <button onClick={() => navigate({ step: '3' })} className="text-sm text-gray-500 hover:text-gray-700">
              Retour
            </button>
            <div className="flex gap-3">
              <Link
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border-2"
                style={{ borderColor: '#25D366', color: '#25D366' }}
              >
                <MessageCircle size={15} /> WhatsApp
              </Link>
              <button
                onClick={() => navigate({ step: 'form', gl: sp.get('gl') ?? 'non' })}
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: '#C9A84C' }}
              >
                Envoyer ma demande
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── FORM ──
  if (step === 'form') {
    const glChoice = sp.get('gl')
    const modPrix = selectedModele?.prixFCFA ?? 0
    const total = Math.round(((parcelleMin ?? 0) + (parcelleMax ?? 0)) / 2) + modPrix
    const waMessage = `Bonjour IMORA AFRICA, j'ai complété une simulation. Zone: ${ville}, Standing: ${STANDING_LABELS[standing] ?? standing}. Je souhaite en savoir plus.`
    const waUrl = waNumber
      ? `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`
      : '#'

    if (formSuccess) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#d1fae5' }}>
            <Check size={36} style={{ color: '#16a34a' }} />
          </div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: '#0D2A4E' }}>
            Votre demande a bien été envoyée !
          </h2>
          <p className="text-gray-500 mt-3">
            Notre équipe va étudier votre projet et vous recontacter dans les 24 heures.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            {waNumber && (
              <Link
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border-2"
                style={{ borderColor: '#0D2A4E', color: '#0D2A4E' }}
              >
                <MessageCircle size={16} /> Suivre sur WhatsApp
              </Link>
            )}
            <Link
              href="/"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      )
    }

    function handleSubmit(fd: FormData) {
      fd.set('sim_pays', pays)
      fd.set('sim_ville', ville)
      fd.set('sim_arrondissement', arrondissement)
      fd.set('sim_standing', standing)
      fd.set('sim_modeleId', selectedModele?.id ?? '')
      fd.set('sim_modeleTitre', selectedModele?.titre ?? '')
      fd.set('sim_modelePrix', String(selectedModele?.prixFCFA ?? ''))
      fd.set('sim_gestionLocative', glChoice ?? 'non')
      fd.set('sim_parcelleEstimMin', String(parcelleMin ?? ''))
      fd.set('sim_parcelleEstimMax', String(parcelleMax ?? ''))
      fd.set('sim_totalEstim', String(total))
      setFormError(null)
      startTransition(async () => {
        const res = await submitSimulation(fd)
        if (res.success) setFormSuccess(true)
        else setFormError(res.error ?? 'Erreur')
      })
    }

    return (
      <div>
        <Progress />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#0D2A4E' }}>
            Vos coordonnées
          </h2>
          <form action={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
                <input name="nom" required className={fieldClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
                <input name="prenom" required className={fieldClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
                <input name="telephone" type="tel" required className={fieldClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input name="email" type="email" required className={fieldClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pays de résidence</label>
              <input name="pays" className={fieldClass} placeholder="France, Canada, USA..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message (optionnel)</label>
              <textarea name="message" rows={3} className={`${fieldClass} resize-none`} />
            </div>

            {/* Extras */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Options supplémentaires</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXTRAS.map((e) => (
                  <label key={e} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" name="extras" value={e} className="rounded border-gray-300" />
                    {e}
                  </label>
                ))}
              </div>
            </div>

            {formError && <p className="text-red-600 text-sm">{formError}</p>}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => navigate({ step: 'recap', gl: glChoice ?? 'non' })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Retour
              </button>
              <div className="flex gap-3">
                <Link
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border-2"
                  style={{ borderColor: '#0D2A4E', color: '#0D2A4E' }}
                >
                  Envoyer via WhatsApp
                </Link>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: '#C9A84C' }}
                >
                  {isPending ? 'Envoi...' : 'Envoyer ma demande'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return null
}
