'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buildWhatsAppUrl, WA_MESSAGES } from '@/lib/whatsapp'

interface WhatsAppButtonProps {
  phone: string
  message?: string
  variant?: 'floating' | 'inline'
  label?: string
  className?: string
}

export function WhatsAppButton({
  phone,
  message = WA_MESSAGES.general,
  variant = 'floating',
  label = 'WhatsApp',
  className,
}: WhatsAppButtonProps) {
  if (!phone) return null

  const href = buildWhatsAppUrl(phone, message)

  if (variant === 'floating') {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nous contacter sur WhatsApp"
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110',
          className
        )}
        style={{ backgroundColor: '#25D366' }}
      >
        <MessageCircle size={28} className="text-white" fill="white" />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90',
        className
      )}
      style={{ backgroundColor: '#25D366' }}
    >
      <MessageCircle size={20} fill="white" />
      {label}
    </Link>
  )
}
