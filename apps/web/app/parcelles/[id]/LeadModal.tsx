'use client'

import { useRef, useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { PaysSelector } from '@imora/ui'
import { submitParcelleLead } from './actions'

interface LeadModalProps {
  parcelleId: string
  parcelleTitre: string
  onClose: () => void
}

export function LeadModal({ parcelleId, parcelleTitre, onClose }: LeadModalProps) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pays, setPays] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(fd: FormData) {
    fd.set('parcelleId', parcelleId)
    setError(null)
    startTransition(async () => {
      const res = await submitParcelleLead(fd)
      if (res.success) setSuccess(true)
      else setError(res.error ?? 'Erreur')
    })
  }

  const fieldClass =
    'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-shadow'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">✓</div>
            <h3 className="text-xl font-semibold" style={{ color: '#0D2A4E' }}>
              Demande envoyée !
            </h3>
            <p className="text-gray-500 mt-2 text-sm">Notre équipe vous contactera dans les 24 heures.</p>
            <button onClick={onClose} className="mt-6 text-sm underline" style={{ color: '#C9A84C' }}>
              Fermer
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-serif font-bold mb-1" style={{ color: '#0D2A4E' }}>
              Je suis intéressé
            </h2>
            <p className="text-sm text-gray-500 mb-6">{parcelleTitre}</p>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nom *</label>
                  <input name="nom" required className={fieldClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Prénom *</label>
                  <input name="prenom" required className={fieldClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Téléphone *</label>
                <input name="telephone" type="tel" required className={fieldClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input name="email" type="email" required className={fieldClass} />
              </div>
              <PaysSelector
                value={pays}
                onChange={setPays}
                name="pays"
                label="Pays de résidence"
              />
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
                <textarea name="message" rows={3} className={`${fieldClass} resize-none`}
                  defaultValue={`Je suis intéressé(e) par : ${parcelleTitre}`} />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#C9A84C' }}
              >
                {isPending ? 'Envoi...' : 'Envoyer ma demande'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
