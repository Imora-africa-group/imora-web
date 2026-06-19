'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, MessageCircle, Check } from 'lucide-react'
import { PriceDisplay } from '@/components/PriceDisplay'
import { LeadModal } from './LeadModal'

interface ParcelleDetailProps {
  parcelle: {
    id: string
    titre: string
    ville: string
    arrondissement: string
    quartier: string
    pays: string
    prixFCFA: number
    superficie: number
    titreFoncier: boolean
    venteNotariee: boolean
    viabilisation: boolean
    distanceGoudron: number | null
    distanceCentreVille: number | null
    tempsCotonou: number | null
    description: string | null
    images: { cloudinaryPublicId: string; isMain: boolean; ordre: number }[]
  }
  rates: { usd: number; eur: number }
  waUrl: string
  imageUrls: string[]
}

export function ParcelleDetail({ parcelle, rates, waUrl, imageUrls }: ParcelleDetailProps) {
  const [current, setCurrent] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const usd = Math.round(parcelle.prixFCFA * rates.usd)
  const eur = Math.round(parcelle.prixFCFA * rates.eur)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
            {imageUrls[current] ? (
              <Image src={imageUrls[current]} alt={parcelle.titre} fill priority className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><MapPin size={48} className="text-gray-300" /></div>
            )}
          </div>
          {imageUrls.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {imageUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`relative h-16 w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    i === current ? 'border-amber-400' : 'border-transparent'
                  }`}
                >
                  <Image src={url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#0D2A4E' }}>
            {parcelle.titre}
          </h1>
          <div className="flex items-center gap-1 mt-2 text-gray-500">
            <MapPin size={14} />
            <span className="text-sm">{parcelle.quartier}, {parcelle.arrondissement}, {parcelle.ville}</span>
          </div>

          <div className="mt-5">
            <PriceDisplay fcfa={parcelle.prixFCFA} usd={usd} eur={eur} size="lg" />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-5">
            {parcelle.titreFoncier && (
              <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border font-medium"
                style={{ borderColor: '#C9A84C', color: '#C9A84C', backgroundColor: '#FFFBEB' }}>
                <Check size={11} /> Titre Foncier
              </span>
            )}
            {parcelle.venteNotariee && (
              <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-blue-200 text-blue-700 bg-blue-50 font-medium">
                <Check size={11} /> Vente Notariée
              </span>
            )}
            {parcelle.viabilisation && (
              <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-green-200 text-green-700 bg-green-50 font-medium">
                <Check size={11} /> Viabilisé
              </span>
            )}
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Superficie</p>
              <p className="font-semibold text-gray-900 mt-1">{parcelle.superficie.toLocaleString('fr-FR')} m²</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Pays</p>
              <p className="font-semibold text-gray-900 mt-1">{parcelle.pays}</p>
            </div>
            {parcelle.distanceGoudron !== null && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Distance goudron</p>
                <p className="font-semibold text-gray-900 mt-1">{parcelle.distanceGoudron} m</p>
              </div>
            )}
            {parcelle.distanceCentreVille !== null && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Distance centre-ville</p>
                <p className="font-semibold text-gray-900 mt-1">{parcelle.distanceCentreVille} km</p>
              </div>
            )}
            {parcelle.tempsCotonou !== null && (
              <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Temps depuis Cotonou</p>
                <p className="font-semibold text-gray-900 mt-1">{parcelle.tempsCotonou} min</p>
              </div>
            )}
          </div>

          {parcelle.description && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
              <p className="text-gray-600 text-sm leading-relaxed">{parcelle.description}</p>
            </div>
          )}

          {/* Desktop CTAs */}
          <div className="flex gap-3 mt-8 hidden lg:flex">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 rounded-full py-3 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Je suis intéressé
            </button>
            <Link
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={18} fill="white" />
              WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 rounded-full py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: '#C9A84C' }}
        >
          Je suis intéressé
        </button>
        <Link
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageCircle size={16} fill="white" />
          WA
        </Link>
      </div>

      {showModal && (
        <LeadModal
          parcelleId={parcelle.id}
          parcelleTitre={parcelle.titre}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
