'use client'

import { useRef, useState, useTransition } from 'react'
import { submitContactForm } from './actions'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(fd: FormData) {
    setError(null)
    startTransition(async () => {
      const res = await submitContactForm(fd)
      if (res.success) {
        setSuccess(true)
        formRef.current?.reset()
      } else {
        setError(res.error ?? 'Erreur inconnue')
      }
    })
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div
          className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-3xl mb-4"
          style={{ backgroundColor: '#d1fae5' }}
        >
          ✓
        </div>
        <h3 className="text-xl font-semibold" style={{ color: '#0D2A4E' }}>
          Message envoyé !
        </h3>
        <p className="text-gray-500 mt-2">Notre équipe vous répondra dans les meilleurs délais.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm underline"
          style={{ color: '#C9A84C' }}
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  const fieldClass =
    'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow'

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet *</label>
        <input name="nom" required className={fieldClass} style={{ '--tw-ring-color': '#C9A84C' } as React.CSSProperties} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
        <input name="email" type="email" required className={fieldClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
        <input name="telephone" type="tel" required className={fieldClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Sujet</label>
        <input name="sujet" className={fieldClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
        <textarea name="message" rows={5} className={`${fieldClass} resize-none`} />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: '#C9A84C' }}
      >
        {isPending ? 'Envoi...' : 'Envoyer le message'}
      </button>
      {/* Hidden prenom field for server action (required by DB schema) */}
      <input type="hidden" name="prenom" value="." />
    </form>
  )
}
