'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import type { Avis } from '@imora/db'

type AvisWithUrl = Avis & { avatarUrl: string | null }

export function TestimonialsCarousel({ avis }: { avis: AvisWithUrl[] }) {
  const [current, setCurrent] = useState(0)

  if (avis.length === 0) return null

  const visible = avis.slice(current, current + 3)
  const canPrev = current > 0
  const canNext = current + 3 < avis.length

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visible.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} fill={n <= a.note ? '#C9A84C' : 'none'}
                  className={n <= a.note ? 'text-amber-400' : 'text-gray-200'} />
              ))}
            </div>
            <p className="text-gray-600 italic text-sm leading-relaxed line-clamp-4">&ldquo;{a.texte}&rdquo;</p>
            <div className="flex items-center gap-3 mt-5">
              {a.avatarUrl ? (
                <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                  <Image src={a.avatarUrl} alt={a.nomClient} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                  {a.nomClient[0]}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-gray-900">{a.nomClient}</p>
                <p className="text-xs text-gray-400">{new Date(a.dateAvis).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {avis.length > 3 && (
        <div className="flex justify-center gap-3 mt-8">
          <button onClick={() => setCurrent((c) => Math.max(0, c - 3))} disabled={!canPrev}
            className="h-10 w-10 rounded-full border-2 flex items-center justify-center text-lg transition-colors disabled:opacity-30"
            style={{ borderColor: '#C9A84C', color: '#C9A84C' }}>‹</button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(avis.length / 3) }).map((_, i) => (
              <button key={i} onClick={() => setCurrent(i * 3)}
                className="h-2.5 w-2.5 rounded-full transition-colors"
                style={{ backgroundColor: Math.floor(current / 3) === i ? '#C9A84C' : '#D1D5DB' }} />
            ))}
          </div>
          <button onClick={() => setCurrent((c) => Math.min(avis.length - 1, c + 3))} disabled={!canNext}
            className="h-10 w-10 rounded-full border-2 flex items-center justify-center text-lg transition-colors disabled:opacity-30"
            style={{ borderColor: '#C9A84C', color: '#C9A84C' }}>›</button>
        </div>
      )}
    </div>
  )
}
