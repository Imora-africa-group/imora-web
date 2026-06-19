import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import type { Settings } from '@imora/db'
import { buildWhatsAppUrl, WA_MESSAGES } from '@imora/db'

interface FooterProps {
  settings: Settings | null
}

export function Footer({ settings }: FooterProps) {
  const waUrl = settings?.whatsappNumber
    ? buildWhatsAppUrl(settings.whatsappNumber, WA_MESSAGES.general)
    : '#'

  return (
    <footer style={{ backgroundColor: '#0D2A4E' }} className="text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="font-serif text-2xl" style={{ color: '#C9A84C' }}>IMORA</span>
              <span className="font-serif text-2xl text-white ml-1.5">AFRICA</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {settings?.sloganText ?? "L'immobilier sécurisé, sans tracasserie"}
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
                {settings?.facebookUrl && (
                <Link href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs font-bold">
                  f
                </Link>
              )}
              {settings?.instagramUrl && (
                <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs font-bold">
                  in
                </Link>
              )}
              {settings?.linkedinUrl && (
                <Link href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs font-bold">
                  li
                </Link>
              )}
              {settings?.youtubeUrl && (
                <Link href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs font-bold">
                  yt
                </Link>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Parcelles', href: '/parcelles' },
                { label: 'Construction', href: '/construction' },
                { label: 'Gestion Locative', href: '/gestion-locative' },
                { label: 'Simulation', href: '/simulation' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Entreprise</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'À Propos', href: '/a-propos' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              {settings?.mentionsLegales && (
                <li>
                  <Link href="/mentions-legales" className="text-white/60 hover:text-white text-sm transition-colors">
                    Mentions légales
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <p className="text-white/60 text-sm mb-4">
              Disponibles 7j/7 pour vous accompagner dans votre projet immobilier.
            </p>
            <Link
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={16} fill="white" />
              WhatsApp
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">IMORA AFRICA © {new Date().getFullYear()} — Tous droits réservés</p>
          {settings?.mentionsLegales && (
            <Link href="/mentions-legales" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Mentions légales
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}
