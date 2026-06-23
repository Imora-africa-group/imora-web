'use client'

import { useRef, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { PaysSelector } from '@imora/ui'
import { submitContactForm } from './actions'

export function ContactForm() {
  const t = useTranslations('contact')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pays, setPays] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(fd: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        const res = await submitContactForm(fd)
        if (res?.success) {
          setSuccess(true)
          formRef.current?.reset()
          setPays('')
        } else {
          setError(res?.error ?? 'Erreur inconnue. Veuillez réessayer.')
        }
      } catch {
        setError('Erreur de connexion. Veuillez réessayer.')
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
          {t('successTitle')}
        </h3>
        <p className="text-gray-500 mt-2">{t('successDesc')}</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm underline"
          style={{ color: '#C9A84C' }}
        >
          {t('sendAnother')}
        </button>
      </div>
    )
  }

  const fieldClass =
    'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow'

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('nomComplet')} *</label>
        <input name="nom" required className={fieldClass} style={{ '--tw-ring-color': '#C9A84C' } as React.CSSProperties} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')} *</label>
        <input name="email" type="email" required className={fieldClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('telephone')} *</label>
        <input name="telephone" type="tel" required className={fieldClass} />
      </div>
      <PaysSelector
        value={pays}
        onChange={setPays}
        name="pays"
        label={t('paysResidence')}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('sujet')}</label>
        <input name="sujet" className={fieldClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('message')}</label>
        <textarea name="message" rows={5} className={`${fieldClass} resize-none`} />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: '#C9A84C' }}
      >
        {isPending ? t('sending') : t('send')}
      </button>
      {/* Hidden prenom field for server action (required by DB schema) */}
      <input type="hidden" name="prenom" value="." />
    </form>
  )
}
