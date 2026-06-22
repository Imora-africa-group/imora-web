import Link from 'next/link'
import Image from 'next/image'
import type { Settings } from '@imora/db'

interface FooterProps {
  settings: Settings | null
}

const navLinks = [
  { label: 'Parcelles', href: '/parcelles' },
  { label: 'Construction', href: '/construction' },
  { label: 'Gestion Locative', href: '/gestion-locative' },
  { label: 'À Propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
  { label: 'Simulation', href: '/simulation' },
]

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-white border-t border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Ligne 1 : nav links | icônes réseaux */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2">
            <span className="text-sm font-semibold text-[#222222]">IMORA AFRICA</span>
            {navLinks.map((l) => (
              <span key={l.href} className="flex items-center gap-4">
                <span className="text-[#D1D5DB] select-none">·</span>
                <Link href={l.href} className="text-sm text-[#222222] hover:underline">
                  {l.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Icônes réseaux sociaux */}
          <div className="flex items-center gap-4 shrink-0">
            {settings?.facebookUrl && (
              <Link href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0D2A4E" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </Link>
            )}
            {settings?.instagramUrl && (
              <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D2A4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="#0D2A4E" stroke="none"/>
                </svg>
              </Link>
            )}
            {settings?.linkedinUrl && (
              <Link href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0D2A4E" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-[#E5E7EB] my-6" />

        {/* Ligne 2 : copyright + légal | numéro WhatsApp */}
        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1">
            <span className="text-xs text-[#717171]">© {new Date().getFullYear()} IMORA AFRICA, Inc.</span>
            <span className="text-[#D1D5DB] text-xs select-none">·</span>
            <Link href="/confidentialite" className="text-xs text-[#717171] hover:underline">Confidentialité</Link>
            <span className="text-[#D1D5DB] text-xs select-none">·</span>
            <Link href="/conditions" className="text-xs text-[#717171] hover:underline">Conditions</Link>
            <span className="text-[#D1D5DB] text-xs select-none">·</span>
            <Link href="/mentions-legales" className="text-xs text-[#717171] hover:underline">Mentions légales</Link>
          </div>

          {settings?.whatsappNumber && (
            <Link
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#717171] hover:text-[#25D366] transition-colors shrink-0"
              aria-label="WhatsApp"
            >
              <Image src="/icon/whatsapp-green.png" width={14} height={14} alt="WhatsApp" />
              {settings.whatsappNumber}
            </Link>
          )}
        </div>

      </div>
    </footer>
  )
}
