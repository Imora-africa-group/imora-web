'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FAQ } from '@imora/db'
import { cn } from '@/lib/utils'

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="divide-y" style={{ borderColor: '#D5D8DC' }}>
      {faqs.map((faq) => (
        <div key={faq.id}>
          <button
            onClick={() => setOpen(open === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between py-5 text-left gap-4"
          >
            <span className="font-semibold text-gray-900 text-sm md:text-base">{faq.question}</span>
            <ChevronDown
              size={18}
              className={cn(
                'shrink-0 transition-transform duration-200',
                open === faq.id ? 'rotate-180' : ''
              )}
              style={{ color: '#C9A84C' }}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              open === faq.id ? 'max-h-96 pb-5' : 'max-h-0'
            )}
          >
            <p className="text-gray-600 text-sm leading-relaxed">{faq.reponse}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
