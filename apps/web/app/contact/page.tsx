import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { prisma } from '@imora/db'
import { buildWhatsAppUrl, WA_MESSAGES } from '@imora/db'
import { ContactForm } from './ContactForm'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact',
  description: "Contactez l'équipe IMORA AFRICA pour toute question sur nos services immobiliers.",
  openGraph: {
    title: 'Contact — IMORA AFRICA',
    description: "Notre équipe est à votre écoute pour répondre à toutes vos questions",
  },
}

export default async function ContactPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const waUrl = settings?.whatsappNumber
    ? buildWhatsAppUrl(settings.whatsappNumber, WA_MESSAGES.general)
    : '#'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 260, backgroundColor: '#0D2A4E' }}>
        <div className="absolute inset-0">
          <Image src="/demo/apart-11.png" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: 'rgba(13,42,78,0.82)' }} />
        </div>
        <div className="relative z-10 py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-serif text-white">Contactez-nous</h1>
            <p className="mt-3 text-white/70 text-lg">
              Notre équipe est à votre écoute pour répondre à toutes vos questions
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: info + WA + map */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#0D2A4E' }}>
                Informations de contact
              </h2>
              <div className="space-y-4">
                {settings?.whatsappNumber && (
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Téléphone</p>
                      <p className="text-gray-500 text-sm">{settings.whatsappNumber}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-500 text-sm">contact@imora-africa.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-500 text-sm">Avenue Jean-Paul II, Cotonou<br />Bénin</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Contactez-nous sur WhatsApp</h3>
              <p className="text-gray-500 text-sm mb-4">
                Pour une réponse immédiate, contactez-nous directement sur WhatsApp
              </p>
              <Link
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full py-3 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
              >
                <span>💬</span> WhatsApp
              </Link>
            </div>

            {/* Map placeholder */}
            <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-400">
                <MapPin size={32} className="mx-auto mb-2" />
                <p className="text-sm">Cotonou, Bénin</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#0D2A4E' }}>
              Envoyez-nous un message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
