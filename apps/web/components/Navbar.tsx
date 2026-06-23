'use client'

import Image from 'next/image'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: t('home'), href: '/' as const },
    { label: t('plots'), href: '/parcelles' as const },
    { label: t('construction'), href: '/construction' as const },
    { label: t('rental'), href: '/gestion-locative' as const },
    { label: t('about'), href: '/a-propos' as const },
    { label: t('contact'), href: '/contact' as const },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  function switchLocale(next: 'fr' | 'en') {
    router.replace(pathname, { locale: next })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/icon/logo-imora.png"
              alt="IMORA AFRICA"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
            <span className="font-serif text-xl font-normal" style={{ color: '#C9A84C' }}>
              IMORA
            </span>
            <span className="font-serif text-xl font-normal -ml-1" style={{ color: '#0D2A4E' }}>
              AFRICA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                style={isActive(link.href) ? { color: '#C9A84C' } : {}}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: CTA + language switcher */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => switchLocale('fr')}
                className={cn(
                  'px-1.5 py-0.5 rounded transition-colors',
                  locale === 'fr' ? 'text-[#0D2A4E]' : 'text-gray-400 hover:text-gray-700'
                )}
              >
                FR
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() => switchLocale('en')}
                className={cn(
                  'px-1.5 py-0.5 rounded transition-colors',
                  locale === 'en' ? 'text-[#0D2A4E]' : 'text-gray-400 hover:text-gray-700'
                )}
              >
                EN
              </button>
            </div>

            <Link
              href="/simulation"
              className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9A84C' }}
            >
              {t('simulate')}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-gray-600"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-amber-50 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                style={isActive(link.href) ? { color: '#C9A84C' } : {}}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/simulation"
              className="mt-3 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: '#C9A84C' }}
            >
              {t('simulate')}
            </Link>
            {/* Mobile language switcher */}
            <div className="mt-2 flex items-center gap-2 px-3 text-sm font-semibold">
              <button
                onClick={() => switchLocale('fr')}
                className={locale === 'fr' ? 'text-[#0D2A4E]' : 'text-gray-400'}
              >
                Français
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => switchLocale('en')}
                className={locale === 'en' ? 'text-[#0D2A4E]' : 'text-gray-400'}
              >
                English
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
