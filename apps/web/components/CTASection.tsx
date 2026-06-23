import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Building2, Key } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { buildWhatsAppUrl, WA_MESSAGES } from '@/lib/whatsapp'

interface CTASectionProps {
  phone: string
}

export async function CTASection({ phone }: CTASectionProps) {
  const t = await getTranslations('cta')
  const waHref = phone ? buildWhatsAppUrl(phone, WA_MESSAGES.general) : '#'

  return (
    <section className="bg-white py-16 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row gap-4">

          {/* Card gauche — investisseurs */}
          <div
            className="flex-1 relative rounded-[20px] p-10 overflow-hidden"
            style={{ backgroundColor: '#0D2A4E' }}
          >
            <Building2
              size={80}
              className="absolute bottom-6 right-6 text-white pointer-events-none select-none"
              style={{ opacity: 0.1 }}
            />
            <p className="text-xs tracking-widest font-medium mb-3" style={{ color: '#C9A84C' }}>
              {t('investorsLabel')}
            </p>
            <h2 className="text-2xl font-bold text-white mb-3">
              {t('investorsTitle')}
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('investorsDesc')}
            </p>
            <Link
              href="/simulation"
              className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9A84C', color: '#0D2A4E' }}
            >
              {t('investorsCta')}
            </Link>
          </div>

          {/* Card droite — propriétaires */}
          <div
            className="flex-1 relative rounded-[20px] p-10 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1A5276, #0D2A4E)' }}
          >
            <Key
              size={80}
              className="absolute bottom-6 right-6 text-white pointer-events-none select-none"
              style={{ opacity: 0.1 }}
            />
            <p className="text-xs tracking-widest font-medium mb-3" style={{ color: '#C9A84C' }}>
              {t('ownersLabel')}
            </p>
            <h2 className="text-2xl font-bold text-white mb-3">
              {t('ownersTitle')}
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('ownersDesc')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold border-2 border-white text-white transition-colors duration-200 hover:bg-white hover:text-[#0D2A4E]"
              >
                {t('ownersCta')}
              </Link>
              {phone && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold border-2 border-white text-white transition-colors duration-200 hover:bg-white hover:text-[#0D2A4E]"
                >
                  <Image src="/icon/whatsapp-white.png" width={18} height={18} alt="WhatsApp" />
                  {t('whatsapp')}
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
